<template>
  <div class="main-container">
  
    <div class="query-box">
      <h2>Rex Chiang</h2>
      <h3>Software Test Engineer</h3>
      
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

      <div class="icon-container">
        <a href="https://linkedin.com/in/rex-chiang-54326734" target="_blank">
          <i class="fab fa-linkedin fa-2x"></i>
        </a>
        <a href="https://github.com/rechiang" target="_blank">
          <i class="fab fa-github fa-2x"></i>
        </a>
        <a href="https://hub.docker.com/r/rechiang/" target="_blank">
          <i class="fab fa-docker fa-2x"></i>
        </a>
        <a href="mailto:rex.chiang@icloud.com">
          <i class="fas fa-envelope fa-2x"></i>
        </a>
      </div>

      <button ref="scrollButton" class="scroll-arrow">
        <img src="@/assets/down_button.png" alt="Scroll Down">
      </button>
    </div>

    <div id="nextSection" class="full-page">
      <div class="about-section">
        <h2>About</h2>
        <div class="about-content">
          <div class="about-photo">
            <img src="@/assets/profile.jpeg" alt="Rex Chiang" />
          </div>
          <div class="about-text">
            <p>Hello, I'm Rex Chiang! I'm a technology enthusiast and have over a decade of experience</p>
            <p>in the tech industry. Currently based in San Francisco, I specialize in designing large-scale</p>
            <p>test systems, CI/CD automation, and cloud computing platforms. I'm well versed in backend</p>
            <p>technologies and I am proficient in various programing languages. I excel at identifying software</p>
            <p> defects leading performance testing efforts, and maintaining high-quality software releases.</p>
          </div>
        </div>
      </div>

      <div class="skills-contact-container"> 
        <div class="skills-section">
          <h2>SKILLS</h2>
          <div class="skills-content">
              <div class="skill" v-for="skill in skills" :key="skill.name">
              <span>{{ skill.name }}</span>
              <div class="skill-bar">
                <div class="skill-level" :style="{ width: `${skill.level}%` }"></div>
                <span class="skill-percentage" :style="{ left: `${skill.level}%` }">{{ skill.level }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <h2>CONTACT</h2>
          <div class="contact-content">
            <p>Email: <a href="rex.chiang@icloud.com">rex.chiang@icloud.com</a></p>
            <p>Phone: +1-669-278-6963</p>
          </div>
        </div>
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
    infoVisible: false,
    apiKey: process.env.VUE_APP_API_KEY,
    skills: [
      { name: 'Virtualization', level: 95 },
      { name: 'Python', level: 70 },
      { name: 'Bash Scripting', level: 90 },
      { name: 'Networking', level: 90 },
      { name: 'Linux', level: 90 },
      { name: 'pytest', level: 80 },
      { name: 'Github', level: 75 },
      { name: 'SQL', level: 65 },
    ]
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
            'Authorization': `Bearer ${this.apiKey}`,
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
      },
        mounted() {
            this.adjustTextareaHeight();
            this.$refs.scrollButton.addEventListener('click', () => {
                const nextElement = document.getElementById("nextSection");
                if (nextElement) {
                    nextElement.scrollIntoView({ behavior: "smooth" });
                }
            });
        }

      }

</script>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  z-index: 1;
  background-image: url("~@/assets/background.jpg");
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #app, .main-container {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: 'IBM Plex Serif', serif;
}

  .query-box {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  }
  .query-box h2 {
    padding-top: 200px;
    font-size: 80px;
    margin-bottom: -20px;
    color: #ffffff;
  }

  .query-box h3 {
    font-size: 18px;
    color: #ffffff;
  }

  .textarea-wrapper {
    position: relative;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }

  .loading-indicator::after {
    content: "...";
    display: inline-block;
    animation: loadingDots 1s steps(4, end) infinite;
    font-size: 30px;
  }

  .input-container, .response-container, .icon-container, .response-input {
    position: relative;
    max-width: 800px;
    width: 100%;
  }

  .query-box input {
    position: relative;
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
    width: 24px;
    height: 24px;
    padding: 0;
  }

  .send-button img {
      width: 100%;
      height: auto;
      display: block;
  }

  .response-input {
    resize: none;  
    overflow: auto;
    width: 100%;
    height: 200px;  
    margin-top: 10px;
    font-size: 20px;        
    padding: 10px 40px 10px 15px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  @keyframes loadingDots {
    0% { content: "."; }
    33% { content: ".."; }
    66% { content: "..."; }
    100% { content: "."; }
  }

  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .icon-container a {
    margin: 0 20px;
    color: #ffffff;
    padding-top: 5px;
    padding-bottom: 290px;
  }

  .icon-container i {
    transition: color 0.3s ease;
  }

  .icon-container a:hover i {
    color: #007bff;
  }

  .scroll-arrow {
    position: absolute;
    bottom: 50px;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, 50%);
    background-color: transparent;
    border: none;
    cursor: pointer;
    }

  .scroll-arrow img {
    filter: invert(1);
    width: 40px;
    height: 40px;
  }

  .full-page {
  min-height: 100vh;
  width: 100%;
  background-color: #0f0f0f;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 768px) {
  .input-container, .response-container, .response-input, .query-box {
    max-width: 100%;
  }
}

.about-section h2 {
  text-align: center;
  align-items: center;
  padding: 20px;
  color: #ffffff;
  font-size: 36px;
}

.about-content {
  margin-bottom: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #b9b9b9;;
}

.about-photo img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

.about-text {
  margin-left: 20px;
  color: #b9b9b9;
}

.skills-contact-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

/* Common styling for both Skills and Contact sections */
.skills-section, .contact-section {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skills-section h2, .contact-section h2 {
  margin-top: 0;
  padding: 0;
  line-height: 1;
  font-size: 22px;
  text-align: center;
  color: white;
}

.skills-content {
  align-items: left;
}

.skill {
  display: flex;
  align-items: center;
  width: 400px;
  justify-content: flex-start;
}

/*List of skills*/
.skill span {
  padding: 12px;
  margin: 0;
  display: inline-block;
  width: 140px;
  font-size: 12px; 
  line-height: 1.5;
  text-align: right;
  color: #b9b9b9;
}

.skill-bar {
  position: relative;
  height: 8px;
  width: 100%;
  background: #313131;
}

.skill-percentage {
  position: absolute;
  top: -30px;
  font-size: 14px;
  color: #ffffff;
  white-space: nowrap;
  transform: translateX(-80%);
}

.skill-level {
  height: 100%;
  width: 100px;
  background: #b9b9b9;
}

.contact-content {
  color: #b9b9b9;
  margin-top: 0;
  margin-bottom: 35px;
  padding: 0;
  line-height: 1;
}

</style>