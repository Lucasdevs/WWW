<template>
  <div id="app">
    <header>
      <h1>App para Recrutadores</h1>
    </header>

    <section class="form-section">
      <h2>Cadastrar Candidato</h2>
      <form @submit.prevent="addCandidate" class="form">
        <div class="form-field">
          <label for="name">Nome:</label>
          <input type="text" id="name" v-model="newCandidate.name" required>
        </div>
        <div class="form-field">
          <label for="contact">Contato:</label>
          <input type="text" id="contact" v-model="newCandidate.contact" required>
        </div>
        <div class="form-field">
          <label for="skills">Habilidades:</label>
          <input type="text" id="skills" v-model="newCandidate.skills" required>
        </div>
        <div class="form-field">
          <label for="hired">Contratado:</label>
          <input type="checkbox" id="hired" v-model="newCandidate.hired">
        </div>
        <div class="form-field" v-if="newCandidate.hired">
          <label for="hireDate">Data de Contratação:</label>
          <input type="date" id="hireDate" v-model="newCandidate.hireDate" required>
        </div>
        <button type="submit" class="btn-submit">Cadastrar</button>
      </form>
      <div>
        <button @click="getCandidatesH()" class="btn-hired">Filtrar por contratados</button>
        <button @click="getCandidatesNonH()" class="btn-hired">Filtrar por não contratados</button>
        <button @click="fetchCandidates()" class="btn-hired">Limpar filtros</button>
      </div>
    </section>

    <section class="table-section">
      <h2>Lista de Candidatos</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Contato</th>
            <th>Habilidades</th>
            <th>Status</th>
            <th>Data de Contratação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="candidate in candidates" :key="candidate.id">
            <td>{{ candidate.name }}</td>
            <td>{{ candidate.contact }}</td>
            <td>{{ candidate.skills }}</td>
            <td>{{ candidate.hired ? 'Contratado' : 'Não Contratado' }}</td>
            <td>{{ candidate.hireDate }}</td>
            <td>
              <button @click="editCandidate(candidate)" class="btn-edit">Editar</button>
              <button @click="deleteCandidate(candidate.id)" class="btn-delete">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      candidates: [],
      newCandidate: {
        id: 1,
        name: '',
        contact: '',
        skills: '',
        hired: false,
        hireDate: ''
      },
      editingCandidate: null
    };
  },
  mounted() {
    this.fetchCandidates();
  },
  methods: {
    fetchCandidates() {
      axios.get('http://localhost:3000/candidates')
        .then(response => {
          this.candidates = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getCandidatesH(){
      axios.get('http://localhost:3000/candidates/hired')
        .then(response => {
          this.candidates = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getCandidatesNonH(){
      axios.get('http://localhost:3000/candidates/non-hired')
        .then(response => {
          this.candidates = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    addCandidate() {
      if(this.editingCandidate){
        this.editingCandidate = this.newCandidate;
        this.saveCandidate();
      } else {
        if(this.newCandidate.hireDate.length && !this.newCandidate.hired){
          this.newCandidate.hireDate = '';
        }
        this.newCandidate.id = Math.floor(Math.random() *1000);
        axios.post('http://localhost:3000/candidates', this.newCandidate)
          .then(response => {
            this.candidates.push(response.data);
            this.resetNewCandidate();
          })
          .catch(error => {
            console.error(error);
          });
        }
    },
    editCandidate(candidate) {
      this.newCandidate = { ...candidate };
      this.editingCandidate = { ...candidate };
    },
    saveCandidate() {
      if(this.editingCandidate.hireDate.length && !this.editingCandidate.hired){
        this.editingCandidate.hireDate = '';
      }
      axios.put(`http://localhost:3000/candidates`, this.editingCandidate)
        .then(response => {
          const index = this.candidates.findIndex(candidate => candidate.id === response.data.id);
          if (index !== -1) {
            this.candidates.splice(index, 1, response.data);
            this.editingCandidate = null;
            this.resetNewCandidate();
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteCandidate(id) {
      axios.delete(`http://localhost:3000/candidates?id=${id}`)
        .then(() => {
          this.candidates = this.candidates.filter(candidate => candidate.id !== id);
        })
        .catch(error => {
          console.error(error);
        });
    },
    resetNewCandidate() {
      this.newCandidate = {
        name: '',
        contact: '',
        skills: '',
        hired: false,
        hireDate: ''
      };
    }
  }
};
</script>

<style>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

.form-section,
.table-section {
  margin-bottom: 40px;
}

.form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-field {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-top: 4px;
}

.btn-submit,
.btn-edit,
.btn-hired,
.btn-delete {
  padding: 8px 16px;
  background-color: #ff3d00;
  margin-top: 3px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-hired {
  background-color: #fbc02d;
  margin-right: 8px;
  margin-left: 2px;
  margin-top: 15px;
}

.btn-edit {
  background-color: #fbc02d;
  margin-right: 8px;
}

.btn-delete {
  background-color: #e53935;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  text-align: left;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>
