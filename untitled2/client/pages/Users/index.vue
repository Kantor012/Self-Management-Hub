<template class="template">
  <div class="container" v-if="getUserData?.role_id===2 || getUserData?.role_id===4">
    <NavHeader :activeIndex="20" />
    <div class="background">
      <div class="mainbody">
        <div class="menu">
          <ul class="elementlist">
            <li class="title">Użytkownicy</li>
            <li ><a href="users/register/">
              <button class="element">Dodaj Konto</button> </a></li>
            <li v-if="this.showDetails === true" class="button-backPosition">
              <a href="./users">
                <button class="element">
                  Wróć
                </button>
              </a>

            </li>
          </ul>
        </div>

        <div v-if="this.showTable" class="tableContainerUsers">
          <table class="tableUsers">
            <thead class="theadusers">
            <tr>
              <th class="th" @click="sortTable('id')" v-if="this.sortBy==='id' && this.sortDirection===1">ID rosnąco</th>
              <th class="th" @click="sortTable('id')" v-else-if="this.sortBy==='id' && this.sortDirection===-1">ID malejąco</th>
              <th class="th" @click="sortTable('id')" v-else>ID</th>
              <th class="th" @click="sortTable('name')" v-if="this.sortBy==='name' && this.sortDirection===1">Imię rosnąco</th>
              <th class="th" @click="sortTable('name')" v-else-if="this.sortBy==='name' && this.sortDirection===-1">Imię malejąco</th>
              <th class="th" @click="sortTable('name')" v-else>Imię</th>
              <th class="th" @click="sortTable('surname')" v-if="this.sortBy==='surname' && this.sortDirection===1">Nazwisko rosnąco</th>
              <th class="th" @click="sortTable('surname')" v-else-if="this.sortBy==='surname' && this.sortDirection===-1">Nazwisko malejąco</th>
              <th class="th" @click="sortTable('surname')" v-else>Nazwisko</th>
              <th class="th" @click="sortTable('role_id')" v-if="this.sortBy==='role_id' && this.sortDirection===1">Rola rosnąco</th>
              <th class="th" @click="sortTable('role_id')" v-else-if="this.sortBy==='role_id' && this.sortDirection===-1">Rola malejąco</th>
              <th class="th" @click="sortTable('role_id')" v-else>Rola</th>
              <th class="th" @click="sortTable('role_name')" v-if="this.sortBy==='role_name' && this.sortDirection===1">Stanowisko rosnąco</th>
              <th class="th" @click="sortTable('role_name')" v-else-if="this.sortBy==='role_name' && this.sortDirection===-1">Stanowisko malejąco</th>
              <th class="th" @click="sortTable('role_name')" v-else>Stanowisko</th>
              <th class="th" @click="sortTable('role_id')" v-if="this.sortBy==='role_id' && this.sortDirection===1">Status rosnąco</th>
              <th class="th" @click="sortTable('role_id')" v-else-if="this.sortBy==='role_id' && this.sortDirection===-1">Status malejąco</th>
              <th class="th" @click="sortTable('role_id')" v-else>Status</th>
              <th class="th">Akcje</th>
            </tr>
            </thead>
            <tbody>
              <tr class="trit" v-for="user in this.employees" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.surname }}</td>
                <td>{{ user.role_id }}</td>
                <td>{{ user.role_name }}</td>
                <td v-if="user.role_id!==0">Aktywny</td>
                <td v-else-if="user.role_id===0">Nieaktywny</td>
                <td>
                  <button class="trit" @click="fetchUserDetails(user.id)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="trit" @click="">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="this.showDetails">
          <div class="tableContainerdetails">
            <table class="tableUserdetails">
              <tbody>
              <tr style="border: black 1px">
                <th class="th">ID: </th>
                <td> {{ selectedUser.id }}</td>
              </tr>
              <tr>
                <th class="th">Imię:</th>
                <td class="tdedit">
                  <span v-if="!editingName" @click="startEditing('Name')">{{ selectedUser.name }}</span>
                  <input v-else v-model="editedName" />
                  <button class="usereditbutton"  v-if="editingName" @click="saveChanges('Name')">OK</button>
                </td>

              </tr>
              <tr>
                <th class="th">Nazwisko:</th>
                <td class="tdedit">
                  <span v-if="!editingSurname" @click="startEditing('Surname')">{{ selectedUser.surname }}</span>
                  <input v-else v-model="editedSurname" />
                  <button class="usereditbutton"  v-if="editingSurname" @click="saveChanges('Surname')">OK</button>
                </td>
              </tr>
              <tr>
                <th class="th">ID roli:</th>
                <td>{{ selectedUser.role_id }} </td>
              </tr>
              <tr>
                <th class="th">Stanowisko:</th>
                <td class="tdedit">
                  <span v-if="!editingPosition" @click="startEditing('Position')">{{ selectedUser.position }}</span>
                  <select v-else v-model="editedPosition">
                    <option value="Gość">Gość</option>
                    <option value="Pracownik">Pracownik</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                  </select>
                  <button class="usereditbutton" v-if="editingPosition" @click="saveChanges('Position')">OK</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container" v-else-if="true">
    <NavHeader :activeIndex="1" />
    <a>
      Nie masz dostępu do tej strony.
    </a>
  </div>

</template>
<script>
import { mapGetters, mapState } from "vuex";
import axios from "axios";

export default {
  name: "index",
  data () {
    return {
      showTable: true,
      showDetails: false,
      selectedUser: {},
      employees: [{}],
      collegues: [{}],
      editingName: false,
      editingSurname: false,
      editingPosition: false,
      editedName: '',
      editedSurname: '',
      editedPosition: '',
      sortBy: '',
      errorPath: '/error',
      sortDirection: 1
    };
  },
  computed: {
    ...mapState(['users']),
    ...mapGetters(['getUserData'])
  },
  async mounted() {
    await this.$store.dispatch('idFromCookies');
    await this.$store.dispatch('fetchUserData');
    if(this.getUserData?.role_id!==2 && this.getUserData?.role_id!==4) {
      await this.$router.push(this.errorPath);
    }
    await this.fetchTables();
  },
  methods: {
    async startEditing(field) {
      if (field === 'Name') {
        this.editingName = true;
        this.editedName = this.selectedUser.name;
      } else if (field === 'Surname') {
        this.editingSurname = true;
        this.editedSurname = this.selectedUser.surname;
      } else if (field === 'Position') {
        this.editingPosition = true;
        this.editedPosition = this.selectedUser.position;
      }
    },
    async saveChanges(field) {
      if (field === 'Name') {
        this.selectedUser.name = this.editedName;
        this.editingName = false;
      } else if (field === 'Surname') {
        this.selectedUser.surname = this.editedSurname;
        this.editingSurname = false;
      } else if (field === 'Position') {
        this.selectedUser.position = this.editedPosition;
        this.editingPosition = false;
        switch(this.selectedUser.position) {
          case 'Gość': this.selectedUser.role_id = 0; break;
          case 'Pracownik': this.selectedUser.role_id = 1; break;
          case 'IT': this.selectedUser.role_id = 2; break;
          case 'HR': this.selectedUser.role_id = 3; break;
          case 'Manager': this.selectedUser.role_id = 4; break;
        }
      }
      const res = await axios.put(
        `${process.env.SERVER_IP}/v1/users/${this.selectedUser.id}`,
        {
          name: this.selectedUser.name,
          surname: this.selectedUser.surname,
          role_id: this.selectedUser.role_id,
          password: this.selectedUser.password,
          email: this.selectedUser.email,
          phone: this.selectedUser.phone
        }
      )
    },
    async fetchUserDetails(userId) {
      try {
        const response = await axios.get(`${process.env.SERVER_IP}/v1/users/${userId}`);

        this.selectedUser = response.data;
        switch(this.selectedUser.role_id) {
          case 0: this.selectedUser.position = 'Gość'; break;
          case 1: this.selectedUser.position = 'Pracownik'; break;
          case 2: this.selectedUser.position = 'IT'; break;
          case 3: this.selectedUser.position = 'HR'; break;
          case 4: this.selectedUser.position = 'Manager'; break;
        }
        this.showDetails = true;
        this.showTable = false;
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
      }
    },
    async fetchTables() {
      try {
        const employeeResponse = await axios.get(`${process.env.SERVER_IP}/v1/users`);
        if (employeeResponse.status === 200) {

          for(const employee of employeeResponse.data) {
            switch(employee.role_id) {
              case 0:
                employee.role_name = "Gość"
                break;
              case 1:
                employee.role_name = "Pracownik"
                break;
              case 2:
                employee.role_name = "Pracownik IT"
                break;
              case 3:
                employee.role_name = "Pracownik HR"
                break;
              case 4:
                employee.role_name = "Manager"
                break;
            }
          }
          this.employees = employeeResponse.data;
        }
      }
      catch (e) {
        console.error("Błąd podczas pobierania danych:", e);
      }
    },
    sortTable(field) {
      if (this.sortBy === field) {
        this.sortDirection *= -1
      } else {
        this.sortBy = field
        this.sortDirection = 1
      }
      this.sortUsers();
    },
    sortUsers() {
      this.employees.sort((a, b) => {
        const valueA = this.getValueByField(a, this.sortBy);
        const valueB = this.getValueByField(b, this.sortBy);
        const isText = typeof valueA === 'string' && typeof valueB === 'string';
        const lowerValueA = isText ? valueA.toLowerCase() : valueA;
        const lowerValueB = isText ? valueB.toLowerCase() : valueB;
        if(lowerValueA < lowerValueB) {
          return -1 * this.sortDirection;
        } else if(lowerValueA > lowerValueB) {
          return this.sortDirection;
        } else {
          return 0;
        }
      });
    },
    getValueByField(obj, field) {
      const fields = field.split('.');
      let value = obj;
      for (const f of fields) {
        value = value[f];
      }
      return value;
    }
  }
};
</script>



<style>
.theadusers th:hover {
  color: red;
  cursor: pointer;
}
.trit{
  color: black;
}
.menu{
  position: relative;
  float: left;
  display: inline-block;
  padding: 1rem 1rem;
  margin-top: 3.5rem;
  margin-left: 1rem;
  vertical-align: middle;
  background-color: white;
  border: 2px solid black;
  height: 790px;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);
  border-collapse: collapse;
  border-radius: 5px 20px 5px;
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
.element{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
.usereditbutton{
  color: black;
}
.theadusers{
  position: sticky;
  top: 0;

}
.tableContainerUsers{
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  width: 82%;
}

.tableUsers{
  display: block;
  height: 790px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  background-color: white;
  color: black;
}
.tableContainerdetails{
  text-align: center;
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  width: fit-content;
}

.tableUserdetails{
  display: block;
  height: fit-content;
  width: 100%;
  background-color: white;
  color: black;
  overflow: hidden;
}
.tableUserdetails .th{
  width: 200px;
}

.tableUserdetails td{
  width: 400px;
}
.tdedit{
  min-width: 200px;

}
.tdedit:hover{
  color: #0f89ec;
  font-weight: bold;
}
.tableContainerusers thead {
  position: sticky;
  top: 0;

}
.tableUsers {
  border-collapse: collapse;
  width: 100%;
}

.chat th {
  background-color: #f2f2f2;
}

.chat td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 30%;
}

.th{
  text-align: center;
  color: white;
  background-color: black;
  width: 350px;


}
.title{

  font-size: 3rem;
  color: black;
  margin: 0 auto;
  font-family: 'Open Sans', sans-serif;

}
.button-backPosition{
  justify-content: center;
  width: 93%;
  font-size: large;
  border-radius: 5px;
  display: block;
  position: absolute;
  bottom: 1rem;
  box-shadow: 5px 5px 10px 2px rgba(0,0,0,.2);

}
.buttonBack{
  color: black;
  border: black 1px solid;
  padding: 1%;
  margin: 1%;
  list-style-type: none;
  font-size: large;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}
.buttonBack:hover{
  background-color: lightgray;
}
.elementlist{
  height: 100%;
}

</style>
