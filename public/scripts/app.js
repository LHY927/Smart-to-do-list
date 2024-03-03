// Client facing scripts here
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#add_new_todo_btn");
const closeButton = document.querySelector("#dialog_cancel_btn");
const confirmButton = document.querySelector("#dialog_confirm_btn");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

// "Confirm" button closes the dialog
confirmButton.addEventListener("click", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#dialog_title_input").value;
    const descriptionInput = document.querySelector("#dialog_description_input").value;
    const dateInput = document.querySelector("#dialog_date_input").value;
    const durationInput = document.querySelector("#dialog_duration_input").value;
    const locationInput = document.querySelector("#dialog_location_input").value;
    addTODOItem(titleInput, descriptionInput, dateInput, durationInput, locationInput)
    dialog.close();
  });

function addTODOItem(type, name, desctiption, date, duration, location) {
    console.log("Add TODO Item for");
    console.log(type);
    console.log(name);
    console.log(desctiption);
    console.log(date);
    console.log(duration);
    console.log(location);
}
