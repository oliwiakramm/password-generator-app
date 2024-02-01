$(document).ready(function () {
  const $sliderEl = $("#length");

  const charUpperLet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charLowerLet = "abcdefghijklmnopqrstuvwxyz";
  const charNums = "0123456789";
  const charSymb = "£$&()*+[]@#^-_!?";

  let sliderValue = 0;

  //CHARACTER LENGTH SLIDER
  $sliderEl.on("input", function () {
    sliderValue = this.value;
    let progressBar = (sliderValue / $sliderEl.attr("max")) * 100;
    $sliderEl.css(
      "background",
      `linear-gradient(to right, #A4FFAF ${
        progressBar - 0.3
      }%, #18171f ${progressBar}%)`
    );

    $(".app__amount").text(sliderValue);
  });

  //PASSWORD GENERATOR FUNCTIONALITY
  $(".app__generate").on("submit", function (e) {
    e.preventDefault();
    const $checkedInputs = $('input[name="options"]:checked');
    const passwordLength = sliderValue;
    let chars = "";

    if ($checkedInputs.length == 0 || passwordLength == 0) {
      return;
    }

    $checkedInputs.each(function () {
      const inputId = $(this).attr("id");

      switch (inputId) {
        case "uppercase":
          chars += charUpperLet;
          break;
        case "lowercase":
          chars += charLowerLet;
          break;
        case "numbers":
          chars += charNums;
          break;
        case "symbols":
          chars += charSymb;

          break;
      }
    });

    $(".app__password")
      .addClass("generated")
      .text(generatePassword(passwordLength, chars));
    calculatePasswordStrength(generatePassword(passwordLength, chars));
  });

  function generatePassword(passLength, chars) {
    return Array.from(crypto.getRandomValues(new Uint32Array(passLength)))
      .map((el) => chars[el % chars.length])
      .join("");
  }

  function calculatePasswordStrength(pass) {
    const passwordStrength = zxcvbn(pass).score;
    const $barsContainer = $(".app__bars");
    const $strengthText = $(".app__power");

    $barsContainer.removeClass();
    $barsContainer.addClass("app__bars");

    $strengthText.addClass("show");
    console.log(passwordStrength);
    switch (passwordStrength) {
      case 0:
      case 1:
        $barsContainer.addClass("tooWeak");
        $strengthText.text("Too weak");
        break;
      case 2:
        $barsContainer.addClass("weak");
        $strengthText.text("weak");
        break;
      case 3:
        $barsContainer.addClass("medium");
        $strengthText.text("medium");
        break;
      case 4:
        $barsContainer.addClass("strong");
        $strengthText.text("strong");
        break;
    }
  }

  //COPY PASSWORD TO CLIPBOARD
  $(".app__copy").on("click", function () {
    const passwordToCopy = $(".app__password").text();
    if (passwordToCopy == "P41$W0rD!") return;
    navigator.clipboard
      .writeText(passwordToCopy)
      .then(() => {
        $(".app__copied").addClass("copied");
        setTimeout(() => {
          $(".app__copied").removeClass("copied");
        }, 700);
      })
      .catch((err) => {
        console.error("Cound not copy your password: ", err);
      });
  });
});
