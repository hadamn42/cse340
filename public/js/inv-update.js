const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#SUBMIT")
      updateBtn.removeAttribute("disabled")
    })