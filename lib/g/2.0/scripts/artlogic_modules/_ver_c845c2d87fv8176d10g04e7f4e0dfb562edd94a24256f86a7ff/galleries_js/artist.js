var artist = {
    init: function() {
        window.galleries.artist.enquire.init();
    },

    enquire: {
        init: function() {
            if ($('#artist_enquire_form.errorOccurred').length != 0) {
                    h.alert('Error: Some of the information entered was missing or incorrect.');
            } else if ($('#artist_enquire_form.captchaError').length != 0) {
                    h.alert('Error: The text entered did not match the image. Please try again.');
            }
        },

        check_form: function() {
                if ($('#f_name').val()=='') {
                        h.alert('Please enter your name.');
                        return false
                } else if (window.app.checkEmail.check('#f_email') == false) {
                        h.alert('Please enter a valid email address.');
                        return false
                } else if ($('#f_message').val()=='') {
                        h.alert('Please enter a message.');
                        return false
                } else if ($('#captcha_answer').val()=='') {
                        h.alert('Ooops! The text entered did not match the image. Please try again.');
                        return false
                }

                return true;

        },

        submit: function() {

            if (window.galleries.artist.enquire.check_form()) {
                document.artist_enquire_form.submit();
            }

        }
    }
}

window.galleries = window.galleries || {};
window.galleries.artist = artist
export default artist