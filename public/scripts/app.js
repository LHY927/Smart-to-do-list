// Client facing scripts here
const dialog = document.querySelector("dialog");
const form = document.querySelector("#TODO_form");
const ongoingItems = document.querySelector(".ongoing_items");
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
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#dialog_title_input").value;
    const descriptionInput = document.querySelector("#dialog_description_input").value;
    const dateInput = document.querySelector("#dialog_date_input").value;
    const durationInput = document.querySelector("#dialog_duration_input").value;
    const locationInput = document.querySelector("#dialog_location_input").value;
    addTODOItem(0, titleInput, descriptionInput, dateInput, durationInput, locationInput)
    dialog.close();
  });

function addTODOItem(type, name, description, date, duration, location) {
    console.log("Add TODO Item for");
    console.log(type);
    console.log(name);
    console.log(description);
    console.log(date);
    console.log(duration);
    console.log(location);
    const newItem = ongoingItems.children[0].cloneNode(true);
    for(const div of newItem.children){
        console.log(div);
        if(div.className == "item_icon"){
            switch(type){
                //For type, 0 for watch icon, 1 for eat icon, 2 for read icon and 3 for buy icon
                case 0:
                    div.children[0].innerText = "live_tv";
                    break;
                case 1:
                    div.children[0].innerText = "restaurant";
                    break;
                case 2:
                    div.children[0].innerText = "auto_stories";
                    break;
                case 3:
                    div.children[0].innerText = "shopping_bag";
                    break;
            }
        }else if(div.className == "item_content"){
            for(const span of div.children){
                if(span.className == "item_title"){
                    span.innerText = name;
                }else if(span.className == "item_countdown"){
                    const target = new Date(date);
                    const today = new Date();
                    const dateDiff = Math.round((target - today) / (1000 * 3600 * 24))
                    if(today.getDate() == target.getDate() && today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()){
                        span.innerText = "Due today";
                    }else if(dateDiff > 0){
                        span.innerText = dateDiff + " days left";
                    }else{
                        span.innerText = Math.abs(dateDiff) + " days ago";
                        span.classList.add("item_countdown_past");
                    }
                }else if(span.className == "item_description"){
                    span.innerText = description;
                }
            }
        }
    }
    ongoingItems.appendChild(newItem);
    form.reset(); 
}
