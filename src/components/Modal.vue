<script setup>
import { doc, updateDoc } from "firebase/firestore";
import { ref, watchEffect } from "vue";
import { toast } from "vue3-toastify";
import { db } from "../firebase";

  const props = defineProps(['type', 'uid']);
  const prompt = ref({});

  watchEffect(() => {
    if (props.type === 1) {
        prompt.value = {
        title: "Delete Prompt",
        lead: "Are you certain you want to proceed with deleting this post? Please note that removing it will make the content inaccessible to students.",
        soft: "However, you can always restore the post later, ensuring students can view it again.",
        button: "Yes, delete it!",
        btnColor: "btn-danger",
        iconColor: "text-danger",
        };
      } else {
        prompt.value = {
        title: "Restore Prompt",
        lead: "Are you sure you want to proceed with restoring this post?",
        soft: "Please be aware that bringing it back will make the content accessible to students once again. ",
        button: "Yes, restore it!",
        btnColor: "btn-warning",
        iconColor: "text-warning",
        };
      }
  })

  const yesBtn = async () => {
    const docRef = doc(db, 'posts', props.uid);
    let tplt;
    if (props.type === 1) {
      tplt = {
        deleted_at: new Date().getTime(),
        restored_at: null,
      }
    }else {
      tplt = {
        deleted_at: null,
        restored_at: new Date().getTime(),
      }
    }
    await updateDoc(docRef, tplt);
    
    if (props.type === 1) {
      toast("Delete Success!\n Post has been successfully deleted.", { "type": "error", "dangerouslyHTMLString": true, "autoClose": 1500})
    }else {
      toast("Restore Success!\n Post has been successfully restored.", { "type": "warning", "dangerouslyHTMLString": true, "autoClose": 1500})
    }
    

    $('#modalTop').modal('hide');
  }
</script>

<template>
  <div class="modal fade" tabindex="-1" id="modalTop">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body modal-body-lg text-center">
          <div class="nk-modal">
            <vue-feather type="alert-triangle" size="110" class="nk-modal-icon" :class="prompt.iconColor" />
            <h4 class="nk-modal-title">{{ prompt.title }}</h4>
            <div class="nk-modal-text">
              <p class="lead">
                {{ prompt.lead }}
              </p>
              <p class="text-soft">
               {{ prompt.soft }}
              </p>
            </div>
            <div class="nk-modal-action mt-5">
              <button
                type="button"
                class="btn"
                @click="yesBtn"
                :class="prompt.btnColor"
              >
                <span>{{ prompt.button }}</span>
              </button>
              <button
                type="button"
                class="btn btn-dim btn-outline-secondary ml-1"
                data-dismiss="modal"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>