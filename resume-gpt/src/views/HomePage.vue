<template>
  <div class="query-box">
    
    <!-- Hamburger Menu Icon -->
    <div class="hamburger-menu" @click="toggleMenu">
        &#9776;
    </div>

    <!-- Hamburger Menu Links -->
    <div v-if="menuVisible" class="menu-items">
        <a href="#">How this was made</a>
        <a href="https://github.com/rechiang/resumeGPT" target="_blank">Link to Rex's repo</a>
    </div>
    
    <h2>Rex's Job Search Assistant</h2>

    <div class="input-container">
      <input 
        v-model="question" 
        placeholder="Ask something about Rex..." 
        @keyup.enter="askOpenAI"
      />
      <button @click="askOpenAI" class="send-button">
          <img src="@/assets/send_button.png" alt="Send" />
      </button>
    </div>

    <div class="response-container">
      <div class="textarea-wrapper">
        <textarea v-model="displayedResponse" class="response-input" readonly></textarea>
        <div v-if="loading" class="loading-indicator"></div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import resumeData from '@/assets/resume.json';

export default {
  name: 'HomePage',
  data() {
  return {
    question: '',
    answer: '',
    loading: false,
    menuVisible: false
  };
},
  computed: {
    displayedResponse() {
      if (this.loading) {
        return '';
      }
      return this.answer;
    }
  },
  watch: {
    displayedResponse() {
        this.$nextTick(this.adjustTextareaHeight);
    }
  },
  methods: {
    adjustTextareaHeight() {
        const textarea = this.$el.querySelector('.response-input');
        const borderHeight = parseInt(window.getComputedStyle(textarea, null).getPropertyValue('border-top-width')) + parseInt(window.getComputedStyle(textarea, null).getPropertyValue('border-bottom-width'));
        const paddingHeight = parseInt(window.getComputedStyle(textarea, null).getPropertyValue('padding-top')) + parseInt(window.getComputedStyle(textarea, null).getPropertyValue('padding-bottom'));

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + borderHeight + paddingHeight}px`;
    },

    async askOpenAI() {
        const endpoint = "https://api.openai.com/v1/chat/completions";
        const headers = {
            'Authorization': `Bearer <API Key>`,
            'Content-Type': 'application/json'
        };

        let messages = [{
            role: "system",
            content: JSON.stringify(resumeData)  // sending the resume data as a system message
        }, {
            role: "system",
            content: "You are a helpful assistant trying to help Rex get a job."
        }, {
            role: "user",
            content: this.question
        }];

        try {
            this.loading = true;
            let response = await axios.post(endpoint, {
                model: "gpt-3.5-turbo",
                messages: messages
            }, { headers: headers });

            const assistantMessage = response.data.choices[0].message.content;
            this.answer = assistantMessage.trim();
            this.$nextTick(this.adjustTextareaHeight);
        } catch (error) {
            console.error("Error fetching the answer:", error);
        } finally {
            this.loading = false;
        }
        },
        toggleMenu() {
          this.menuVisible = !this.menuVisible;
          }
      },
      mounted() {
        this.adjustTextareaHeight();
      }
    }
</script>

<style>
.query-box h2 {
  font-size: 50px; /* Adjust this to your desired font size */
  margin-bottom: 15px;
  color: #333;
}

.textarea-wrapper {
  position: relative; /* This makes it a reference for absolutely positioned child elements */
}

.loading-indicator {
  position: absolute; /* This allows us to place the dots on top of the textarea */
  top: 50%; /* Centers vertically */
  left: 10px; /* A small left margin to avoid the dots being too close to the border */
  transform: translateY(-50%); /* Ensures vertical centering */
}

.loading-indicator::after {
  content: "...";
  display: inline-block;
  animation: loadingDots 1s steps(4, end) infinite;
  font-size: 30px;
}

.query-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.input-container, .response-container {
  position: relative;
  width: 800px;
  display: flex;
  align-items: center;
}

.query-box input {
  font-size: 20px;        
  padding: 10px 40px 10px 15px;
  width: 100%;  
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    width: 24px;     /* Adjust these dimensions based on your image's size */
    height: 24px;    /* Adjust these dimensions based on your image's size */
    padding: 0;      /* Remove padding if there's any */
    overflow: hidden; /* Hide any parts of the image that might overflow */
}

.send-button img {
    width: 100%;     /* Make the image take the full width of the button */
    height: auto;    /* Maintain the image's aspect ratio */
    display: block;  /* Remove any line-height related gaps below the image */
}

.response-input {
  resize: none;  
  overflow: auto;
  width: 800px; 
  height: 200px;  
  margin-top: 10px;
  font-size: 20px;        
  padding: 10px 40px 10px 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.hamburger-menu {
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
    font-size: 34px;
    z-index: 1000;
}

.menu-items {
    position: absolute;
    top: 60px;
    left: 20px;
    background: #fff;
    box-shadow: 0px 0px 8px rgba(0,0,0,0.2);
    border-radius: 4px;
    overflow: hidden;
    z-index: 999;
}

.menu-items a {
    display: block;
    padding: 10px 20px;
    text-decoration: none;
    color: black;
}

.menu-items a:hover {
    background: #eee;
}

@keyframes loadingDots {
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
  100% { content: "."; }
}
</style>
