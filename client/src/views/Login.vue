<template>
  <v-form v-model='valid' @submit.prevent='username && password && login()'>
    <header class='display-3'>Vue
      <strong class='font-weight-bold'>Music</strong>
    </header>
    <section class='content'>
      <v-text-field autofocus :rules='usernameRules' type='text' v-model='username' label='Username' required />
      <v-text-field class='mb-3' :rules='passwordRules' :type='passwordShowing ? "text" : "password"' v-model='password' label='Password' required />
      <v-btn type='submit' raised class='primary' :disabled='!valid'>Login</v-btn>
      <v-btn flat class='primary--text' :disabled='!valid' @click='register'>Register</v-btn>
    </section>
  </v-form>
</template>

<script>
export default {
  name: 'login',
  mounted() {
    //checks for valid session
    this.$store.dispatch('authenticate');
  },
  data() {
    return {
      username: '',
      password: '',
      passwordShowing: false,
      valid: false,
      usernameRules: [v => !!v || 'Username is required'],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be at least 8 characters'
      ]
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      });
    },
    register() {
      this.$store.dispatch('register', {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.show-toggle {
  cursor: pointer;
  user-select: none;
  font-weight: bold;
}

form {
  margin: auto;
  max-width: 30rem;
  width: calc(100% - 4rem);
  position: relative;
}

header {
  position: absolute;
  bottom: 100%;
  width: 100%;
  opacity: 0;
  animation: fade-in 0.35s 0.15s forwards,
    transform-from-down 0.35s 0.15s forwards;
  font-weight: 100;
  font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

  will-change: opacity, transform;

  strong {
    color: #673ab7;
  }
}

label.label {
  font-weight: 600 !important;
}

.content {
  opacity: 0;
  transform: scaleY(0);
  animation: fade-in 0.5s 0.85s forwards, scaleY-regular 0.35s 0.5s forwards;
  will-change: opacity, transform;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
@keyframes scaleY-regular {
  to {
    transform: scaleY(1);
  }
}
@keyframes transform-from-down {
  from {
    transform: translateY(2rem);
  }
  to {
    transform: translateY(0);
  }
}
</style>