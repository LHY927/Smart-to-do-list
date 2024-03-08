// Client facing scripts here
const dialog = document.querySelector("dialog");
const form = document.querySelector("#TODO_form");
const ongoingItems = document.querySelector(".ongoing_items");
const completedItems = document.querySelector(".completed_items");
const showButton = document.querySelector("#add_new_todo_btn");
const closeButton = document.querySelector("#dialog_cancel_btn");
const confirmButton = document.querySelector("#dialog_confirm_btn");
const ongoingItemsList = [];
const completedItemsList = [];

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
    addTODOItem(0, titleInput, descriptionInput, dateInput, durationInput, locationInput, ongoingItems, ongoingItemsList)
    dialog.close();
  });

function addTODOItem(type, name, description, date, duration, location, targetNode, targetList) {
    console.log("Add TODO Item for");
    console.log(type);
    console.log(name);
    console.log(description);
    console.log(date);
    console.log(duration);
    console.log(location);
    const newItem = targetNode.children[0].cloneNode(true);
    newItem.removeAttribute("style");
    targetList.push(newItem);

    for(const div of newItem.children){
        console.log(div);
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
    targetNode.appendChild(newItem);
    form.reset();
}

function clickCompleteOnList(event){
    event.target.parentNode.style.display = "none";
    const item = event.target.parentNode.parentNode.parentNode.parentNode;
    const newItem = item.cloneNode(true);
    completedItemsList.push(newItem);
    completedItems.appendChild(newItem);
    ongoingItemsList.splice(ongoingItemsList.indexOf(item), 1);
    item.parentNode.removeChild(item);
}

function clickRemoveOnList(event){
    console.log(event)
    const item = event.target.parentNode.parentNode.parentNode.parentNode;
    if(ongoingItemsList.indexOf(item) > 0){
        ongoingItemsList.splice(ongoingItemsList.indexOf(item), 1);
    }else{
        completedItemsList.splice(completedItemsList.indexOf(item), 1);
    }
    item.parentNode.removeChild(item);
}
module.exports = router;
