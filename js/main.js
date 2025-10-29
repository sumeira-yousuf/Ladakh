// EmailJS Configuration

const EMAILJS_SERVICE_ID = "service_wzfo9df";
const EMAILJS_TEMPLATE_ID = "template_toqo3u6";
const EMAILJS_PUBLIC_KEY = "st7TIIV_ztcXD_aif";

(function () {
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

$(document).ready(function () {
  feather.replace();

  const images = [
    "images/amazing.webp",
    "images/beautiful-ladakh.webp",
    "images/ladkh-turkh.webp",
  ];

  let index = 0;
  let currentLayer = 1;
  const $bg1 = $("#background-slideshow-1");
  const $bg2 = $("#background-slideshow-2");

  // Set initial image
  $bg1.css("background-image", `url(${images[index]})`);

  setInterval(() => {
    index = (index + 1) % images.length;

    if (currentLayer === 1) {
      $bg2.css("background-image", `url(${images[index]})`);
      $bg2.css("opacity", 1);
      $bg1.css("opacity", 0);
      currentLayer = 2;
    } else {
      $bg1.css("background-image", `url(${images[index]})`);
      $bg1.css("opacity", 1);
      $bg2.css("opacity", 0);
      currentLayer = 1;
    }
  }, 4000);

  // Initialize Owl Carousel
  var owl = $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: false, // Disable default navigation
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  });

  // Custom Navigation
  $("#nextBtn").click(function () {
    owl.trigger("next.owl.carousel");
  });
  $("#prevBtn").click(function () {
    owl.trigger("prev.owl.carousel");
  });

  // Modal Functions
  function openModal() {
    $("#tripModal").removeClass("hidden");
    $("body").css("overflow", "hidden"); // Prevent background scrolling
  }

  function closeModal() {
    $("#tripModal").addClass("hidden");
    $("body").css("overflow", "auto"); // Restore scrolling
    // Reset form and button on close
    resetForm(formConfigs.tripForm);
    // Reset form submission source
    formSubmissionSource = null;
  }

  // Modal Event Listeners with source tracking
  $("#openModal").click(function () {
    formSubmissionSource = "Banner Form";
    openModal();
  });

  $(".enquire-btn").click(function () {
    formSubmissionSource = "Package Booking - Enquiry";
    openModal();
  });

  $(".callback-btn").click(function () {
    formSubmissionSource = "Callback Request";
    openModal();
  });

  $("#closeModal").click(closeModal);

  // Close modal when clicking on overlay
  $("#tripModal").click(function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  $(document).keydown(function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  const $backToTopBtn = $("#backToTop");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      $backToTopBtn
        .removeClass("opacity-0 invisible")
        .addClass("opacity-100 visible");
    } else {
      $backToTopBtn
        .addClass("opacity-0 invisible")
        .removeClass("opacity-100 visible");
    }
  });

  // Smooth scroll to top
  $backToTopBtn.click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
  });

  // FAQ Toggle Function
  window.toggleFAQ = function (id) {
    const $answer = $(`#content-${id}`);
    const $icon = $(`#icon-${id}`);

    if ($answer.hasClass("hidden")) {
      $answer.removeClass("hidden");
      $icon.text("−");
    } else {
      $answer.addClass("hidden");
      $icon.text("+");
    }
  };

  // Form Configuration Objects
  const formConfigs = {
    tripForm: {
      selectors: {
        form: "#tripForm",
        firstName: "#firstName",
        email: "#email",
        phone: "#phone",
        tripDetails: "#tripDetails",
        submitBtn: "#submitBtn",
        progressBar: "#progressBar",
      },
      errorClass: "error-message",
      progressInterval: "progressInterval",
      buttonText: "Let's Plan My Trip!",
      defaultSubject: "Banner Form",
    },
    contactForm: {
      selectors: {
        form: "#contactForm",
        firstName: "#contactFirstName",
        email: "#contactEmail",
        phone: "#contactPhone",
        tripDetails: "#contactTripDetails",
        submitBtn: "#contactSubmitBtn",
        progressBar: "#contactProgressBar",
      },
      errorClass: "contact-error-message",
      progressInterval: "contactProgressInterval",
      buttonText: "LET'S PLAN MY TRIP!",
      defaultSubject: "Plan Your Perfect Trip with GR Travel",
    },
  };

  // Track form submission source
  let formSubmissionSource = null;

  // Universal Form Handler
  function handleFormSubmission(config) {
    $(config.selectors.form).submit(function (e) {
      e.preventDefault();

      try {
        // Get form data
        const formData = {
          firstName: $(config.selectors.firstName).val().trim(),
          email: $(config.selectors.email).val().trim(),
          phone: $(config.selectors.phone).val().trim(),
          tripDetails: $(config.selectors.tripDetails).val().trim(),
        };

        // Validate form
        if (!validateFormData(formData, config)) {
          return;
        }

        // Show loading state
        showLoadingState(config);

        // Determine subject based on form source or default
        // For contactForm, always use its default subject; for tripForm (modal), use tracked source
        const subject =
          config === formConfigs.contactForm
            ? config.defaultSubject
            : formSubmissionSource ||
              config.defaultSubject ||
              "Form Submission";

        // Prepare email parameters
        const emailParams = {
          from_name: formData.firstName,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.tripDetails,
          to_name: "gR Travel Team",
          subject: subject,
        };

        // Send email using EmailJS with try-catch
        try {
          emailjs
            .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams)
            .then(function (response) {
              console.log(
                "Email sent successfully!",
                response.status,
                response.text
              );

              // Complete progress bar and redirect
              completeProgressBar(config);
              setTimeout(function () {
                window.location.href = "thank-you-for-submit-ladakh.html";
              }, 1000);
            })
            .catch(function (error) {
              console.error("Failed to send email:", error);
              resetSubmitButton(config);
              alert(
                "Sorry, there was an error sending your message. Please try again or contact us directly."
              );
            });
        } catch (emailError) {
          console.error("Error in email sending:", emailError);
          resetSubmitButton(config);
          alert(
            "Sorry, there was an error sending your message. Please try again or contact us directly."
          );
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        resetSubmitButton(config);
        alert(
          "Sorry, there was an error processing your form. Please try again."
        );
      }
    });
  }

  // Initialize both forms
  handleFormSubmission(formConfigs.tripForm);
  handleFormSubmission(formConfigs.contactForm);

  // Universal Form Validation
  function validateFormData(data, config) {
    let isValid = true;

    // Clear previous error states
    clearErrorStates(config);

    // Validate first name
    if (!data.firstName) {
      showFieldError(
        config.selectors.firstName,
        "First name is required",
        config
      );
      isValid = false;
    }

    // Validate email
    if (!data.email) {
      showFieldError(config.selectors.email, "Email is required", config);
      isValid = false;
    } else if (!isValidEmail(data.email)) {
      showFieldError(
        config.selectors.email,
        "Please enter a valid email address",
        config
      );
      isValid = false;
    }

    // Validate phone
    if (!data.phone) {
      showFieldError(
        config.selectors.phone,
        "Phone number is required",
        config
      );
      isValid = false;
    } else if (!isValidPhone(data.phone)) {
      showFieldError(
        config.selectors.phone,
        "Please enter a valid phone number",
        config
      );
      isValid = false;
    }

    // Validate trip details
    if (!data.tripDetails) {
      showFieldError(
        config.selectors.tripDetails,
        "Trip details are required",
        config
      );
      isValid = false;
    }

    return isValid;
  }

  // Utility Functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  function showFieldError(fieldId, message, config) {
    $(fieldId).addClass("border-red-500 bg-red-50");

    // Remove existing error message
    $(fieldId).siblings(`.${config.errorClass}`).remove();

    // Add error message
    $(fieldId).after(
      `<span class="${config.errorClass} text-red-500 text-sm mt-1 block">${message}</span>`
    );
  }

  function clearErrorStates(config) {
    $(
      `${config.selectors.form} input, ${config.selectors.form} textarea`
    ).removeClass("border-red-500 bg-red-50");
    $(`.${config.errorClass}`).remove();
  }

  // Universal Loading State Functions
  function showLoadingState(config) {
    const $submitBtn = $(config.selectors.submitBtn);
    $submitBtn.prop("disabled", true);
    $submitBtn.html(`
      <div class="relative w-full">
        <div class="bg-orange-400 rounded h-2 w-full">
          <div id="${config.selectors.progressBar.replace(
            "#",
            ""
          )}" class="bg-white h-2 rounded transition-all duration-300 ease-out" style="width: 0%"></div>
        </div>
        <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">Sending...</span>
      </div>
    `);

    // Start progress animation
    startProgressAnimation(config);
  }

  function startProgressAnimation(config) {
    let progress = 0;
    const interval = setInterval(function () {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;

      $(config.selectors.progressBar).css("width", progress + "%");

      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);

    // Store interval ID for cleanup
    window[config.progressInterval] = interval;
  }

  function completeProgressBar(config) {
    // Clear any existing interval
    if (window[config.progressInterval]) {
      clearInterval(window[config.progressInterval]);
    }

    // Complete the progress bar
    $(config.selectors.progressBar).css("width", "100%");

    // Update button text
    $(`${config.selectors.submitBtn} .relative span`).text("Complete!");
  }

  function resetSubmitButton(config) {
    // Clear any existing interval
    if (window[config.progressInterval]) {
      clearInterval(window[config.progressInterval]);
    }

    const $submitBtn = $(config.selectors.submitBtn);
    $submitBtn.prop("disabled", false);
    $submitBtn.html(config.buttonText);
  }

  // Universal Form Reset Functions
  function resetForm(config) {
    $(config.selectors.form)[0].reset();
    clearErrorStates(config);
    resetSubmitButton(config);
  }

  // Review Text Truncation and Toggle Functionality
  const reviewConfigs = [
    { textId: "review-text-1", buttonId: "toggle-btn-1", maxLength: 150 },
    { textId: "review-text-2", buttonId: "toggle-btn-2", maxLength: 120 },
    { textId: "review-text-3", buttonId: "toggle-btn-3", maxLength: 100 },
    { textId: "review-text-4", buttonId: "toggle-btn-4", maxLength: 100 },
    { textId: "review-text-5", buttonId: "toggle-btn-5", maxLength: 150 },
  ];

  // Initialize review text truncation after a small delay to ensure carousel is ready
  setTimeout(() => {
    reviewConfigs.forEach((config) => {
      // Use class selectors instead of IDs to handle cloned elements
      $(`.owl-carousel .item`).each(function (index) {
        const $textElement = $(this).find(`#${config.textId}`);
        const $toggleButton = $(this).find(`#${config.buttonId}`);

        if (
          $textElement.length &&
          $toggleButton.length &&
          !$textElement.hasClass("processed")
        ) {
          // Mark as processed to avoid duplicate processing
          $textElement.addClass("processed");

          const fullText = $textElement.text().trim();

          if (fullText.length > config.maxLength) {
            let truncateAt = config.maxLength;
            const lastSpaceIndex = fullText.lastIndexOf(" ", config.maxLength);
            if (lastSpaceIndex > config.maxLength - 20) {
              truncateAt = lastSpaceIndex;
            }

            const truncatedText =
              fullText.substring(0, truncateAt).trim() + "...";

            $textElement.text(truncatedText);
            $textElement.data("full-text", fullText);
            $textElement.data("truncated-text", truncatedText);
            $textElement.data("is-expanded", false);

            // Show the toggle button and set initial text
            $toggleButton.removeClass("hidden").text("view more");

            $toggleButton.off("click").on("click", function () {
              const isExpanded = $textElement.data("is-expanded");

              if (isExpanded) {
                $textElement.text($textElement.data("truncated-text"));
                $textElement.data("is-expanded", false);
                $toggleButton.text("view more");
              } else {
                $textElement.text($textElement.data("full-text"));
                $textElement.data("is-expanded", true);
                $toggleButton.text("hide");
              }
            });
          } else {
            $toggleButton.addClass("hidden");
          }
        }
      });
    });
  }, 100);

  // Gallery scroll animation functionality
  function initGalleryAnimations() {
    const galleryRows = document.querySelectorAll(".gallery-row");

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const row = entry.target;
            const items = row.querySelectorAll(".gallery-item");

            // Add animate class to the row
            row.classList.add("animate");

            // Add animate class to each item with staggered delay
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("animate");
              }, index * 100); // 100ms delay between each item
            });

            // Stop observing this row after it's animated
            observer.unobserve(row);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the row is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before the element comes into view
      }
    );

    // Start observing each gallery row
    galleryRows.forEach((row) => {
      observer.observe(row);
    });
  }

  // Initialize gallery animations
  initGalleryAnimations();
});
