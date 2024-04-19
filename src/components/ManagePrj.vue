<template>
    <div class="heading">
        <img src="../assets/CpppImage.png" alt="error" class="center-image"><br><br>

        <div class="project-management">
            <h1 class="project-management_title">
                <span class="project-management_title-text">Manage</span> Project
            </h1>
        </div>
        <div class="current-members">
            <button class="current-members__count" :class="{ 'current-members__count--active': isCurrentMembersActive }"
                @click="onCurrentMembersClick">
                Current Members
            </button>
            /
            <button class="current-members__applicants"
                :class="{ 'current-members__applicants--active': !isCurrentMembersActive }"
                @click="onPendingApplicantsClick">
                Pending Applicants
            </button>
        </div>

        <section class="member-list" v-if="isCurrentMembersActive">
            <div class="member-item" v-for="member in projectMembers">
                <div class="member-info">
                    <div class="member-avatar"></div>
                    <div class="member-name">{{ member.name }}</div>
                </div>
                <div class="pos-button"><button class="remove-btn" @click="removeMember(member.userID)">Remove</button>
                </div>
            </div>
        </section>

        <section class="member-list" v-if="!isCurrentMembersActive">
            <div class="member-item" v-for="member in pendingMembers">
                <div class="member-info">
                    <div class="member-avatar"></div>
                    <div class="member-name">{{ member.name }}</div>
                </div>
                <div class="pos-button">
                    <button class="reject-btn" @click="rejectMember(member.userID)">Reject</button>
                    <button class="accept-btn" @click="acceptMember(member.userID)">Accept</button>
                </div>
            </div>
        </section>

        <div class="project-actions">
            <button class="delete-project-btn" @click="deleteProject">Delete Project</button>
            <button class="complete-project-btn" @click="markCompleted">Mark Project as Completed</button>
        </div>
    </div>

</template>

<script>
import firebaseApp from '../Firebase.js';
import firebase from '../uifire.js';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, getDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import router from '@/router';

const db = getFirestore(firebaseApp);

export default {
    name: 'ManagePrj',

    data() {
        return {
            projectName: "",
            projectID: "",
            projectMembers: [],
            pendingMembers: [],
            isCurrentMembersActive: true,
        };
    },

    async mounted() {
        this.fetchMemberDetails();

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.uid = user.uid;
            }
        });

    },

    methods: {
        async fetchMemberDetails() {
            this.projectID = this.$route.params.id;
            let docRef = doc(db, "Project Collection", this.projectID);
            let docSnap = await getDoc(docRef);
            let projectData = docSnap.data();
            this.projectName = projectData.projectName;
            this.currentID = projectData.projectMembers;
            this.pendingID = projectData.pendingMembers;

            for (const memberID of this.currentID) {
                let userDocRef = doc(db, "User Information", memberID);
                let userDocSnap = await getDoc(userDocRef);
                let userData = userDocSnap.data();
                this.projectMembers.push({ name: userData.name, userID: memberID });
            }

            for (const memberID of this.pendingID) {
                let userDocRef = doc(db, "User Information", memberID);
                let userDocSnap = await getDoc(userDocRef);
                let userData = userDocSnap.data();
                this.pendingMembers.push({ name: userData.name, userID: memberID });
            }

        },

        onCurrentMembersClick() {
            this.isCurrentMembersActive = true;
        },
        onPendingApplicantsClick() {
            this.isCurrentMembersActive = false;
        },

        async removeMember(memberId) {
            const projectRef = doc(db, "Project Collection", this.projectID);
            const userRef = doc(db, "User Information", memberId); // cannot update the user's currentProjects field, after remove 

            this.projectMembers = this.pendingMembers.filter(member => member.userID !== memberId);

            await Promise.all([
                updateDoc(projectRef, {
                    projectMembers: arrayRemove(memberId)
                }),
                updateDoc(userRef, {
                    currentProjects: arrayRemove(this.projectID)
                })
            ]);
            

            alert("Member Removed");

            // reload the page
            window.location.reload();

            // Update UI without page reload
        },

        async rejectMember(memberId) {
            const projectRef = doc(db, "Project Collection", this.projectID);

            await updateDoc(projectRef, {
                pendingMembers: arrayRemove(memberId)
            });

            this.pendingMembers = this.pendingMembers.filter(member => member.userID !== memberId);
            alert("Member Rejected");

            window.location.reload();
        },

        async acceptMember(memberId) {
            const projectRef = doc(db, "Project Collection", this.projectID);
            const userRef = doc(db, "User Information", memberId);

            await Promise.all([
                updateDoc(projectRef, {
                    pendingMembers: arrayRemove(memberId),
                    projectMembers: arrayUnion(memberId)
                }),
                updateDoc(userRef, {
                    currentProjects: arrayUnion(this.projectID)
                })
            ]);

            this.pendingMembers = this.pendingMembers.filter(member => member.userID !== memberId);
            alert("Member Accepted");
            
            window.location.reload();
            // Update UI without page reload
        },

        async deleteProject() {
            await deleteDoc(doc(db, "Project Collection", this.projectID));
            alert("Project Deleted");
            router.push('/project');
        },

        async markCompleted() {
            const projectRef = doc(db, "Project Collection", this.projectID);
            await updateDoc(projectRef, {
                projectCompleted: true
            });

            const userRef = doc(db, "User Information", uid);
            const userDocSnap = await getDoc(userRef);
            if (userDocSnap.exists()) {
                await updateDoc(userRef, {
                    pastProjects: arrayUnion({ id: this.projectID })
                });
            } else {
                await setDoc(userRef, {
                    pastProjects: [{ id: this.projectID }]
                });
            }

            alert("Project Completed");

            router.push('/project');
        },
    },

}
</script>

<style scoped>
img {
    height: 170px;
    width: 100%;
}

.project-management {
    text-align: center;
    align-self: center;
}

.project-management_title {
    color: #f76d28;
    font: 600 50px/1 Inter, sans-serif;
}

.project-management_title-text {
    color: #000;
    font: 600 50px/1 Inter, sans-serif;
}

.current-members {
    padding-left: 7%;
    color: #000;
    margin-top: 40px;
    font: 600 25px Inter, sans-serif;
}

.current-members__count {
    color: #000;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
}

.current-members__count--active {
    color: rgba(245, 121, 59, 1);
}

.current-members__applicants {
    color: #000;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
}

.current-members__applicants--active {
    color: rgba(245, 121, 59, 1);
}

.member-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 40px;
    margin-top: 39px;
    padding-left: 7%;
}

.member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 0 1px;
}

.member-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 23px;
    color: #4d4d4d;
    line-height: 1.2;
}

.member-avatar {
    width: 47px;
    height: 47px;
    border-radius: 50%;
    background-color: rgba(245, 121, 59, 0.7);
}

.member-name {
    font-family: Inter, sans-serif;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.reject-btn {
    background-color: #e7e2e0;
    color: #000;
    margin-right: 20px;
}

.remove-btn,
.accept-btn,
.complete-project-btn {
    background-color: #f5793b;
    color: #fff;

}

.remove-btn,
.reject-btn,
.accept-btn {
    border: none;
    padding: 16px 32px;
    font: 600 18px/1 Inter, sans-serif;
    cursor: pointer;

}

.pos-button {
    padding-right: 10%;
}

.project-actions {
    display: flex;
    gap: 20px;
    margin-top: 46px;
    padding-left: 7%;
}

.delete-project-btn,
.complete-project-btn {
    border: none;
    padding: 16px 32px;
    font: 600 18px/1 Inter, sans-serif;
    cursor: pointer;


}
</style>
