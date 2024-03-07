// Client facing scripts here
const dialog = document.querySelector("dialog");
const form = document.querySelector("#TODO_form");
const ongoingItems = document.querySelector(".ongoing_items");
const completedItems = document.querySelector(".completed_items");
const showButton = document.querySelector("#add_new_todo_btn");
const closeButton = document.querySelector("#dialog_cancel_btn");
const confirmButton = document.querySelector("#dialog_confirm_btn");
const itemsList = [];
const ongoingItemsList = [];
const completedItemsList = [];

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
    //Hide the icon for recognized types for adding new item as the types haven't been recognized yet.
    document.querySelector(".dialog_icons").style.display = "none";
    dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
    confirmButton.submissionType = 0
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

    if(confirmButton.submissionType == undefined || confirmButton.submissionType == 0){
        //If the dialog is for adding item
        //TODO: Use the recognized type
        addTODOItem(0, titleInput, descriptionInput, dateInput, durationInput, locationInput, ongoingItems, itemsList)
    }else{
        //If the dialog is for edit item
        //TODO: Use the recognized type
        editTODOItem(0, titleInput, descriptionInput, dateInput, durationInput, locationInput, itemsList[confirmButton.submissionType - 1]);
        confirmButton.submissionType = 0;
    }
    dialog.close();
  });

function addTODOItem(type, name, description, date, duration, location, targetNode, targetList) {
    const newItem = targetNode.children[0].cloneNode(true);
    newItem.removeAttribute("style");
    targetList.push(newItem);
    form.reset()

    editItemTexts(newItem, type, name, description, date, duration, location, targetNode);

    newItem.addEventListener('click', function(e) {
        console.log(e.target);
        if (e.target.innerText == "Complete" || e.target.innerText == "Remove" || e.target.className.includes("small_button")){
            return;
        }
        dialog.showModal();
        document.querySelector(".dialog_icons").style.display = "flex";
        //Reset the icons font color
        for(const icon of document.querySelector(".dialog_icons").children){
            icon.style.color = "black";
        }
        document.querySelector(".dialog_icons").children[type].style.color = "#66A034";
        document.querySelector("#dialog_title_input").value = name;
        document.querySelector("#dialog_description_input").value = description;
        document.querySelector("#dialog_date_input").value = date;
        document.querySelector("#dialog_duration_input").value = duration;
        document.querySelector("#dialog_location_input").value = location;
        //Set the type of the button to -1 to notify the eventlistener of dialog submit.
        confirmButton.submissionType = targetList.length;
      });

    targetNode.appendChild(newItem);
    form.reset(); 
}

function editTODOItem(type, name, description, date, duration, location, targetItem) {
    editItemTexts(targetItem, type, name, description, date, duration, location);

    targetItem.addEventListener('click', function(e) {
        console.log(e.target);
        if (e.target.className.includes('small_button')){
            return;
        }
        dialog.showModal();
        document.querySelector(".dialog_icons").style.display = "flex";
        //Reset the icons font color
        for(const icon of document.querySelector(".dialog_icons").children){
            icon.style.color = "black";
        }
        document.querySelector(".dialog_icons").children[type].style.color = "#66A034";
        document.querySelector("#dialog_title_input").value = name;
        document.querySelector("#dialog_description_input").value = description;
        document.querySelector("#dialog_date_input").value = date;
        document.querySelector("#dialog_duration_input").value = duration;
        document.querySelector("#dialog_location_input").value = location;
      });

    form.reset(); 
}

//Function for editing the display information of items.
function editItemTexts(item, type, name, description, date, duration, location){
    for(const div of item.children){
        console.log(div);
        //Handle the display of different components in the item
        if(div.className.includes("item_icon")){
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
        }else if(div.className.includes("item_content")){
            for(const child of div.children){
                if(child.className.includes("item_title")){
                    child.innerText = name;
                }else if(child.className.includes("item_countdown")){
                    const target = new Date(date);
                    const today = new Date();
                    //Calculate the days to target date
                    const dateDiff = Math.round((target - today) / (1000 * 3600 * 24))
                    if(today.getDate() == target.getDate() && today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()){
                        child.innerText = "Due today";
                    }else if(dateDiff > 0){
                        child.innerText = dateDiff + " days left";
                    }else{
                        child.innerText = Math.abs(dateDiff) + " days ago";
                        child.classList.add("item_countdown_past");
                    }
                }else if(child.className.includes("item_description")){
                    child.innerText = description;
                }
            }
        }else if(div.className.includes("item_control")){
            for(const child of div.children){
                console.log(child)
                if(child.className.includes("item_title")){
                    console.log("got");
                    child.innerText = "Due on " + date;
                }else if(child.className.includes("item_description")){
                    child.children[1].innerText = location;
                }
            }
        }
    }
}

//If user clicked the complete button, move the item to completed section
function clickCompleteOnList(event){
    event.target.parentNode.style.display = "none";
    const item = event.target.parentNode.parentNode.parentNode.parentNode;
    const newItem = item.cloneNode(true);
    completedItems.appendChild(newItem);
    item.parentNode.removeChild(item);
}

//If user clicked the complete button, remove the item
function clickRemoveOnList(event){
    console.log(event)
    const item = event.target.parentNode.parentNode.parentNode.parentNode;
    item.parentNode.removeChild(item);
    itemsList.slice(itemsList.indexOf(item), 1);
}
