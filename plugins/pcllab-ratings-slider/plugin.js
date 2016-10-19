/**
 * @name Ratings Slider
 *
 * @param {string} title - This title will appear above the instructions.
 * @param {string} instructions - The text prompt that is displayed above the ratings slider.
 * @param {string} [label_left=Strongly Disagree] - Label that is displayed on the left side of the ratings slider.
 * @param {string} [label_right=Strongly Agree] - Label that is displayed on the right side of the ratings slider.
 * @param {string} [button_text=Next] - The label of the question set in the json file that the plugin should use.
 * @param {number} [slider_value=50] - The value at which the slider is set to by default.
 * @param {number} [slider_step=1] - The amount of numbers between each 'step' of the slider.
 * @param {boolean} [display_value=false] - Display the currently selected value?
 * @param {boolean} [hot_and_cold_slider=false - Display the slider with blue on the left side and red on the right side.
 *
 * @author Garrick Buckley
 */

jsPsych.plugins["pcllab-ratings-slider"] = (function () {

  var plugin = {};

  plugin.trial = function (display_element, trial) {
    var startTime = (new Date()).getTime();
    var firstInteractionTime;

    // default trial parameters
    trial.title = trial.title || "";
    trial.label_left = trial.label_left || "Strongly Disagree";
    trial.label_right = trial.label_right || "Strongly Agree";
    trial.button_text = trial.button_text || "Next";;

    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    ratingsSlider = $('<div>', {
      class: "pcllab-ratings-slider"
    });

    // Instructions
    instructions = $('<div>', {
      class: "pcllab-ratings-slider-instructions"
    });

    instructions.append($('<p>' + trial.instructions + '</p>'));

    var slider;

    // Slider
    if(trial.hot_and_cold_slider) {
      slider = $('<div>', {
        class: "pcllab-ratings-slider-slider pcllab-ratings-school-slider"
      });
    } else {
      slider = $('<div>', {
        class: "pcllab-ratings-slider-slider"
      });
    }

    slider.append($('<div>' + trial.label_left + '</div>'));

    console.log(trial.slider_value);
    slider.append($('<input>', {
      type: "range",
      value: trial.slider_value,
      step: trial.slider_step,
    }));

    slider.append($('<div>' + trial.label_right + '</div>'));

    slider.on('change', function() {
      if (!firstInteractionTime) {
        firstInteractionTime = (new Date()).getTime() - startTime;
      }
    });

    // Button
    button = $('<div>', {
      class: "pcllab-button-container"
    });

    button.append($('<button>', {
      class: "btn btn-primary btn-lg pcllab-ratings-button",
      text: trial.button_text
    }).on('click', function() {
        end_trial();
      }));

    ratingsSlider.append("<h1 style='text-align: center; padding-bottom: 12px;'>" + trial.title + "</h1>");
    ratingsSlider.append(instructions);
    ratingsSlider.append(slider);

    if (trial.display_value) {
      sliderValue = $('<div>', {
        class: "pcllab-slider-value"
      });

      $(slider).change(function() {
        $('.pcllab-slider-value').html(($(this).find('input').val()));
      });

      sliderValue.html(trial.slider_value || 50);

      ratingsSlider.append(sliderValue);
    }

    ratingsSlider.append(button);

    display_element.append(ratingsSlider);

    function end_trial() {
      var time = (new Date()).getTime() - startTime;
      var trial_data = {
        total_time: time,
        "first_interaction_time": firstInteractionTime || -1,
        "value": $(".pcllab-ratings-slider-slider > input").val() || -1
      };

      display_element.html('');
      jsPsych.finishTrial(trial_data);
    };
  };

  return plugin;
})();
