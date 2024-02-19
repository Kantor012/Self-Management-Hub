<template>

  <div class="container" v-if="getUserData?.role_id!==null">
    <NavHeader :activeIndex=5 />
    <div class="background">
    <!-- Krok 1: Wybór Miesiąca i Roku -->
    <div class="date">
      <select class="select" v-model="selectedMonth" @change="updateCalendarData" >
        <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
      </select>
      <select class="select" v-model="selectedYear" @change="updateCalendarData" >
        <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
      </select>
    </div>
    <!-- Krok 3: Generowanie Kolumn Dni -->
      <div class="tableContainer">
    <table class="table" v-if="availabilityLoaded">
      <thead>
      <tr>
        <div class ="test">
        <th class="tabledate">{{ months[selectedMonth] }} - {{ selectedYear }}</th>
        </div>
        <th class="headercell" v-for="(day, index) in calendarDays" :key="index">
          <div class="day-number">{{ day }}</div> <!-- Wyśrodkowany numer dnia -->
        </th>
      </tr>
      </thead>
      <tbody>
      <!-- Krok 5: Generowanie Wierszy Tabeli -->

      <tr v-for="(employee, index) in employees" :key="index">
        <th class="button-center">
          <!-- Krok 6: Wyświetlanie Szczegółowych Informacji -->
          <button @click="showDetails(employee)">
            {{ employee.name }} {{ employee.surname }}
          </button>
        </th>
        <!--        TODO: pobranie dostępności pracownika z bazy danych i przypisanie do danego dnia odpowiedniego koloru-->
        <td
          v-for="(date, dayIndex) in calendarDates"
          :key="dayIndex"
          :class="getCellClass(employee.availability, date)"
          class="table-cell" >
        </td>
      </tr>
      </tbody>
    </table>
      </div>
    <!-- Krok 6: Wyświetlanie Szczegółowych Informacji -->
    <div v-if="selectedEmployee" class="employee_data">
      <!-- Tutaj możesz wyświetlić szczegółowe informacje o pracowniku -->
      {{selectedEmployee.id}}<br>
      {{selectedEmployee.name}} {{selectedEmployee.surname}}<br>
      {{selectedEmployee.phone}}<br>
      {{selectedEmployee.email}}<br>
      {{selectedEmployee.role_name}}<br>
    </div>
</div>
  </div>
  <div class="container" v-else-if="getUserData?.role_id===0 || getUserData?.role_id===null">
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapState } from "vuex";
require('dotenv').config();
const serverip = process.env.SERVER_IP;

export default {
  data() {
    return {
      availabilityLoaded: false,
      firstColumnWidth: 10,
      columnWidth: 5,
      selectedMonth: 0,
      selectedYear: 2023,
      currentMonth: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      showCalendar: false,
      months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
      years: [2022, 2023, 2024], // Zakres lat do wyboru
      daysInMonth: new Date(2023, 0, 0).getDate(),
      firstDayOfWeek: new Date(2023, 0, 1).getDay(), // 0 - niedziela, 1 - poniedziałek, ...
      calendarDates: [],
      errorPath: '/error',
      employees: [
        {
          id: null,
          name: null,
          surname: null,
          phone: null,
          email: null,
          role_id: null,
          availability: [
            {
              availability_id: null,
              from_date: null,
              to_date: null,
            }
          ]
        },
      ],
      selectedEmployee: null,
    };
  },
  methods: {
    getDateNow() {
      try {
        const current = new Date();
        this.selectedMonth = current.getMonth();
        this.selectedYear = current.getFullYear();
      } catch (er) {
        console.error("Błąd podczas ustawiania obecnej daty: ", er);
      }
    },
    async updateCalendarData() {
      try {
        await this.fetchAvailability();
        this.generateCalendar();
      } catch (error) {
        console.error('Błąd podczas pobierania danych o dostępności pracowników:', error);
      }
    },
    async fetchAvailability() {
      try {
        const response = await axios.get(`${process.env.SERVER_IP}/v1/availability`, {
          params: {
            month: this.selectedMonth + 1,
            year: this.selectedYear,
          }
        });
        const availabilityData = response.data.data;
        this.employees.forEach((employee) => {
          employee.availability = availabilityData.filter((item) => item.user_id === employee.id);
        });
      } catch (error) {
        console.error('Błąd podczas pobierania danych o dostępności pracowników:', error);
      }
    },
    getCellClass(availability, day) {
      if (availability) {
        if (availability.some((item) =>
          Math.floor(new Date(item?.from_date).getTime()) <= Math.floor(new Date(day).getTime())
          && Math.floor(new Date(item?.to_date).getTime()) >= Math.floor(new Date(day).getTime())
          && item.availability_id === 1)) {
          return "urlop";
        } else if (availability.some((item) =>
          Math.floor(new Date(item?.from_date).getTime()) <= Math.floor(new Date(day).getTime())
          && Math.floor(new Date(item?.to_date).getTime()) >= Math.floor(new Date(day).getTime())
          && item.availability_id === 2)) {
          return "delegacja";
        } else {
          return "dostepny";
        }
      }
    },
    generateCalendar() {

      const daysInMonth = new Date(this.selectedYear, this.selectedMonth+1, 0).getDate()
      this.calendarDays = [];
      for (let i = 1; i <= daysInMonth; i++) {
        this.calendarDays.push(i);
      }
      this.calendarDates = this.generateCalendarDates()
    },
    generateCalendarDates() {
      const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
      const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
      const dates = [];

      for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
      }

      return dates;
    },
    async fetchEmployees() {
      try {
        const response = await axios.get(`${process.env.SERVER_IP}/v1/users`);
        this.employees = response.data.map(user => ({
          id: user?.id,
          name: user?.name,
          surname: user?.surname,
          phone: user?.phone,
          email: user?.email,
          role_id: user?.role_id,
        }));
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    },
    showDetails(employee) {
      this.selectedEmployee = employee;
    },
  },
  computed: {
    ...mapGetters(['getUserData']),
    ...mapState(['users']),
  },
  async mounted() {
    await this.$store.dispatch('fetchUserData');
    await this.$store.dispatch('idFromCookies');
    if(this.getUserData?.role_id===null || this.getUserData?.role_id===0) {
      await this.$router.push(this.errorPath);
    }
    await this.fetchEmployees();
    await this.fetchAvailability();
    this.generateCalendar();
    this.availabilityLoaded = true;
  },
  created() {
    this.getDateNow();
  },
};
</script>

<style scoped>
.headercell{
  border: 2px solid black;
  position: sticky;
  top: 0;

}
.background{
  width: 90%;
  color: white;
  background: linear-gradient(135deg, cornflowerblue, rgba(150, 129, 149, 0.98));
  display: block;
  justify-content: center;
  border-radius: 5px 20px 5px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  min-height: 90vh;
  padding-top: 1rem;
  margin-top: 2rem;

}

/* Stylizacja dla kolorów dostępności */
.delegacja {
  background-color: #e07e0f;
  text-align: center;
}
.urlop {
  background-color: green;
  text-align: center;
}
.dostepny {
  background-color: white;
  text-align: center;
}
th:first-child {
  background-color: lightseagreen;
  text-align: center;
}

.table-cell {
  width: 10rem;
  text-align: center;


}

.day-number {

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 3rem;
  text-align: center;
  position: sticky;
  top: 0;
}

.custom-table th:first-child {
  min-width: 10px;
  background-color: #ffffff;
  color: white;
  text-align: center;
}


.custom-table th:not(:first-child) {
  min-width: 10px;
  background-color: grey;
  text-align: center;

}
.employee_data{
  position: absolute;
  font-weight: 700;
  border-radius: 5%;
  display:block;
  top: 0;
  right: 0;
padding: 1rem;
  background-color: #2596be;

  text-align:center;
  font-size: large;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.8);

}

thead{
  position: sticky;
  top: 0;
  background-color: lightblue;

}
.date{
  margin-top: 5%;
  margin-left: 3%;
}
.tableContainer{
  margin-left: 3%;
}
.test{
  position: sticky;
  top: 0;

}
.tabledate{
  width: 19rem;
  position: sticky;
  top: 0;
}
.table{
  display: block;
  border-collapse: separate;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 600px;
}

.button-center {
  text-align: center;
  border: 1px solid black;
  white-space: nowrap;
  background: black;


}

.select {

  margin: 0 auto;
  width: 80%;
  min-width: 15ch;
  max-width: 30ch;

  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
}


</style>
