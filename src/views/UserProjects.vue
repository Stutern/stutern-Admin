<template>
    <div class="wrapper">
        <b-row class="sect-two">
            <b-col class="topp" sm="6" xs="12">
                <p class="name">
                    {{userDetails.userName}}
                </p>
                <p class="jobTitle">
                    {{userDetails.jobTitle}}
                </p>
                <p class="userdesc">
                    {{userDetails.userEmail}}
                </p>
                <p class="link">
                    <a :href="userDetails.userCV" target="_blank" rel="noopener noreferrer">
                        {{userDetails.userCV}}
                    </a>
                </p>
                <p class="userdesc">
                    {{userDetails.userDesc}}
                </p>
            </b-col>
            <b-col class="topp" sm="6" xs="12">
                <img class="topp-img" :src="userDetails.userPhoto" alt="">
            </b-col>

            <b-col sm="6" v-if="userProjects.length > 0">
                <p class="Projects name">
                    Projects
                </p>
            </b-col>
            <b-col sm="6" v-if="userProjects.length > 0">
                <button class="edit add" @click="openAdd()">
                    Add Project
                </button>
            </b-col>
            <b-col class="card-container" v-for="(project, i) in userProjects" :key="i" sm="6" xs="12">
                <div class="card">
                    <img class="card-img" :src="project.projectBanner" alt="">
                    <p class="card-text-heading">
                        {{project.projectTitle}}
                    </p>
                    <p class="card-text-content">
                        {{project.projectDesc}}
                    </p>
                </div>
                <div class="overlay">
                    <!-- <button class="edit" @click="openEdit(project._id)">
                        Edit
                    </button> -->
                    <button class="delete" @click="delteProject(project._id)">
                        Delete
                    </button>
                </div>
            </b-col>


            <b-col style="text-align: center" sm="12" xs="12" v-if="userProjects.length === 0">
                <img src="../assets/empty.svg" class="empty-img" alt="">
                <p class="empty">
                    This user has no projects
                    <button @click="openAdd()">
                        Create project
                    </button>
                </p>
            </b-col>
        </b-row>
        <b-modal v-model="addModal" centered title="Add Project" :hide-footer="true">
            <label> Project title</label>
            <b-form-input
                style="margin-bottom:20px; height: 55px;"
                type="text"
                required
                label= "name"
                v-model="newProject.projectTitle"
                class="inp"
                placeholder="" />

            <label> Project description</label>
            <b-form-textarea
                id="textarea"
                v-model="newProject.projectDesc"
                style="margin-bottom:20px;"
                rows="3"
                max-rows="6"
                />


            <label>
                Scholarship Banner <img v-if="isUploading"  src="../assets/loading.svg" class="spin-img" alt="">
            </label>
            <b-form-file v-model="imgFile" class="inp" v-on:change="upload($event.target.files)" placeholder="Upload Project Banner"></b-form-file>

            <button class="edit" style="float: right;
                                        background-color: #00D7C4;
                                        border: 0;
                                        color: #fff;
                                        padding: 12px 30px;
                                        border-radius: 6px;
                                        margin-top: 20px;" @click="addToList()">Create Project</button>
        </b-modal>

        <b-modal v-model="editProject" centered title="Edit Project" :hide-footer="true">
            <b-form-input
                style="margin-top:12px; height: 55px;"
                type="text"
                required
                label= "name"
                v-model="selectedProject.projectTitle"
                class="inp"
                placeholder="" />

            <b-form-textarea
                id="textarea"
                placeholder="Enter something..."
                v-model="selectedProject.projectDesc"
                class="inp"
                rows="3"
                max-rows="6"
                />


            <label>
                Scholarship Banner <img v-if="isUploading"  src="../assets/loading.svg" class="spin-img" alt="">
            </label>
            <button class="edit" style="float: right;
                                        background-color: #00D7C4;
                                        border: 0;
                                        color: #fff;
                                        padding: 12px 30px;
                                        border-radius: 6px;
                                        margin-top: 20px;" @click="submitCreate()">Save</button>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios';
import services from '../myServices';

export default {
  data() {
    return {
      editProject: false,
      addModal: false,
      imgFile: null,
      addDisabled: true,
      isUploading: false,
      selectedProject: {},
      userDetails: {},
      userProjects: [],
      newProject: {
        projectTitle: '',
        projectDesc: '',
        projectBanner: '',
      },
    };
  },
  computed: {
    cloudinary: 'getCloudinaryPresets',
  },
  beforeMount() {
    this.getProjects();
  },

  methods: {
    getProjects() {
      services.getUserProjects(this.$route.params.id)
        .then((res) => {
          console.log(res);
          this.userDetails = res.data.userDetails;
          this.userProjects = res.data.userProjects;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openAdd() {
      this.addModal = true;
    },
    addToList() {
      console.log('clicked');
      if (this.newProject.projectTitle !== '' && this.newProject.projectDesc !== '') {
        this.$swal({
          title: 'Add project',
          text: 'You are about to add a new project!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        })
          .then((response) => {
            if (response.value) {
              services.addProject({
                ...this.newProject,
                projectUserId: this.userDetails._id,
              })
                .then((res) => {
                  this.getProjects();
                  this.addModal = false;
                  this.$swal({
                    type: 'success',
                    text: 'Project successfully added',
                    title: 'success',
                  });
                })
                .catch((err) => {
                  this.$swal({
                    type: 'error',
                    text: err.response.data.error,
                    title: 'error',
                  });
                });
            }
          });
      } else {
        this.$swal({
          type: 'error',
          text: 'Enter all the fields',
          title: 'Fill all fields',
        });
      }
    },
    makeid(length) {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

      return text;
    },
    upload(e) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', e[0]);
      formData.append('upload_preset', this.cloudinary.uploadPreset);
      formData.append('public_id', this.makeid(20));
      this.$http.post(`https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/image/upload`, formData)
        .then((res) => {
          this.isUploading = false;
          this.newProject.projectBanner = res.body.secure_url;
          this.addDisabled = false;
        })
        .catch((err) => {
          this.$swal({
            title: 'Error',
            type: 'error',
            text: err.body.error.message,
          });
        });
    },
    // openEdit () {
    // },
    openEdit(id) {
      this.selectedProject = this.userProjects.find(proj => proj._id === id);
      this.editProject = true;
    },
    delteProject(id) {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
        .then((result) => {
          if (result.value) {
            services.deleteUserProjects(id)
              .then((res) => {
                console.log(res);
                this.getProjects();
                this.$swal({
                  type: 'success',
                  text: 'Project successfully deleted',
                  title: 'Success',
                });
              })
              .catch((err) => {
                this.$swal({
                  type: 'error',
                  text: err.response.data.error,
                  title: 'Error',
                });
              });
          }
        });
    },
    submitCreate() {
      this.$swal({
        title: 'Are you sure?',
        text: "You won't be about to edit this project",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
        .then((result) => {
          if (result.value) {
            services.updateUserProjects(id)
              .then((res) => {
                console.log(res);
                this.getProjects();
                this.$swal({
                  type: 'success',
                  text: 'Project successfully edited',
                  title: 'Success',
                });
              })
              .catch((err) => {
                this.$swal({
                  type: 'error',
                  text: err.response.data.error,
                  title: 'Error',
                });
              });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
    .wrapper {
        width: 100%;
        min-height: 100vh;
        overflow-x: hidden;
        background-color: #FAFAFA
    }
    .inp {
        margin-top: 12px !important
    }
    .sect-two {
        padding: 60px 100px;
        .name {
            color:#47b8a3;
            font-size: 25px;
            margin-top: 20px;
            margin-bottom: 0 !important
        }
        .empty {
            color: #67747C;
            width: 100%;
            font-size: 25px;
            text-align: center;
            button {
                background-color: #00D7C4;
                color: #fff;
                border: 0 !important;
                border-radius: 6px;
                margin-left: 12px;
                font-size: 14px;
                padding: 10px 30px;
                cursor: pointer;
            }
        }
        .empty-img {
            width: 400px;
            margin: 30px auto;
        }
        .jobTitle {
            color:#a3a7a6;
            font-size: 15px;
            margin-top: 0 !important
        }
        .userdesc {
            color:#8c8c8c;
            font-size: 13px;
            font-style: italic;
            margin-top: 0 !important
        }
        .topp {
            border-bottom: 1px solid #eee;
            padding-bottom: 40px !important
        }
        .topp-img {
            height: 150px;
            width: auto;
            float: right;
        }
        .sect-two-heading {
            font-family: 'Playfair Display', serif;
            width: 100%;
            text-align: center;
            margin: 20px 0;
            font-style: normal;
            font-weight: bold;
            line-height: normal;
            font-size: 24px;
            text-align: center;
            color: #222829;
        }
        .card-container {
            padding: 0 20px;
            margin: 0 0 40px 0;
            overflow: hidden;
            height: 500px;
            p {
                margin: 12px 0px
            }
            .card {
                background: #FFFFFF;
                // box-shadow: 0px 2.5px 5px rgba(0, 0, 0, 0.05);
                padding: 0 !important;
                height: 500px;
                border: 0 !important;
                border-radius: 0 !important;
                overflow: hidden;
                .card-img {
                    height: 290px;
                    margin: 0;
                    border-radius: 0;
                    margin-bottom: 15px
                }
                .card-text-heading {
                    font-style: normal;
                    font-weight: bold;
                    line-height: normal;
                    font-size: 20px;
                    padding: 0 20px !important;
                    font-family: 'Playfair Display', serif;
                    color: #222829;
                }
                .card-text-subheading {
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    font-size: 18px;
                    margin-top: 0 !important;
                    padding: 0 20px !important;
                    color: #67747C;
                }
                .card-text-content {
                    font-style: normal;
                    font-weight: normal;
                    line-height: 24px;
                    font-size: 16px;
                    padding: 0 20px !important;
                    color: #67747C;
                }
                .more {
                    font-style: normal;
                    font-weight: 600;
                    line-height: 26px;
                    font-size: 18px;
                    margin: 20px;
                    color: #00D7C4;
                    cursor: pointer;
                    img {
                        width: 30px;
                        height: auto;
                        margin-left: 12px
                    }
                }
            }
        }
        .overlay {
            background-color: #000;
            width: 100%;
            height: 550px;
            opacity: 0.9;
            transition: linear all 0.3s;
            // display: flex;
            align-items: center;
            text-align: center;
            button {
                border: 0;
                // background-color: #fff;
                width: 30%;
                margin: 40px 10px;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
            }
            .delete {
                background-color: red;
                color: #fff
            }
        }
        .card-container:hover .overlay {
            margin-top: -210px;
        }
        .edit {
            background-color: #00D7C4;
            border: 0;
            color: #fff;
            padding: 12px 30px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .add {
            float: right;
        }
    }
</style>
