// Client facing scripts here
const dialog = document.querySelector("dialog");
const form = document.querySelector("#TODO_form");
const ongoingItems = document.querySelector(".ongoing_items");
const completedItems = document.querySelector(".completed_items");
const showButton = document.querySelector("#add_new_todo_btn");
const closeButton = document.querySelector("#dialog_cancel_btn");
const confirmButton = document.querySelector("#dialog_confirm_btn");
const itemsList = [];
const toDoItems = {};
const url = "http://localhost:8080/";

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
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
    //CategoryId stands for the currently selected category. 0 Stands for to Watch, 1 stands for to Eat, 2 stands for to Read and 3 stands for to Buy
    let categoryId = 3;
    for(let index = 0; index < document.querySelector(".dialog_icons").children.length; index++){
        //Searching for the selected category by font color.
        if(document.querySelector(".dialog_icons").children[index].style.color == "#66A034" ||
          document.querySelector(".dialog_icons").children[index].style.color == "rgb(102, 160, 52)"){
            categoryId = index;
            console.log("got categoryId " + index);
            break;
        }
    }

    if(confirmButton.submissionType == undefined || confirmButton.submissionType == 0){
        //If the dialog is for adding item
        var data = {
            url: locationInput,
            duration: durationInput,
            title: titleInput,
            category_id: categoryId + 1, //As the sequence in db starts from 1, add 1 to the categoryId
            description: descriptionInput,
            due_date: new Date(dateInput),
            completed: false
        };
          
          // Make the AJAX POST request for add new item
          $.ajax(url + "api/todoitems/new", {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data), // Convert the JavaScript object to a JSON string
          })
          .done(function (response) {
            // This function is called when the request is successful
            console.log(response);
            addTODOItem(categoryId, titleInput, descriptionInput, dateInput, durationInput, locationInput, ongoingItems, itemsList, response["toDoItems"].id);
            toDoItems[response["toDoItems"].id] = response["toDoItems"];
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            // This function is called when the request fails
          console.log("Request failed: " + textStatus + ", " + errorThrown);
        });
    }else{
        const targetItem = itemsList[confirmButton.submissionType - 1];
        //If the dialog is for edit item
        var data = {
            url: locationInput,
            duration: durationInput,
            title: titleInput,
            category_id: categoryId + 1, //As the sequence in db starts from 1, add 1 to the categoryId
            description: descriptionInput,
            due_date: new Date(dateInput),
            completed: toDoItems[targetItem.index].completed
        };

        // Make the AJAX POST request for edit existing item
        $.ajax(url + "api/todoitems/" + confirmButton.itemIndex, {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data), // Convert the JavaScript object to a JSON string
          })
          .done(function (response) {
            // This function is called when the request is successful
            console.log(response);
            editTODOItem(categoryId, titleInput, descriptionInput, dateInput, durationInput, locationInput, targetItem);
            toDoItems[response["toDoItems"].id] = response["toDoItems"];
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            // This function is called when the request fails
          console.log("Request failed: " + textStatus + ", " + errorThrown);
        });
        confirmButton.submissionType = 0;
    }
    dialog.close();
  });

function initialize(){
    $.ajax(url + "api/todoitems", {
        method: "GET",
        contentType: "application/json",
      })
      .done(function (response) {
        // This function is called when the request is successful
        console.log(response);
        $.ajax(url + "api/users/" + response["toDoItems"][0].user_id, {
            method: "GET",
            contentType: "application/json",
          })
          .done(function (users) {
            // This function is called when the request is successful
            console.log(users["users"]);
            document.querySelector("#user_welcome").innerText = "Welcome, " + users["users"].name;
          })
        for(const item of response["toDoItems"]){
            toDoItems[item.id] = item;
            if(item.completed){
                addTODOItem(item.category_id - 1, item.title, item.description, item.due_date, item.duration, item.url, completedItems, itemsList, item.id);
            }else{
                addTODOItem(item.category_id - 1, item.title, item.description, item.due_date, item.duration, item.url, ongoingItems, itemsList, item.id);
            }
        }
      })
}

function addTODOItem(type, name, description, date, duration, location, targetNode, targetList, todoIndex) {
    
    const newItem = targetNode.children[0].cloneNode(true);
    newItem.index = todoIndex;
    newItem.removeAttribute("style");
    targetList.push(newItem);
    const currLength = targetList.length;
    form.reset()

    editItemTexts(newItem, type, name, description, date, duration, location);

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

        let targetDate = new Date(date);

        document.querySelector(".dialog_icons").children[type].style.color = "#66A034";
        document.querySelector("#dialog_title_input").value = name;
        document.querySelector("#dialog_description_input").value = description;
        document.querySelector("#dialog_date_input").value = targetDate.toISOString().split('T')[0];
        document.querySelector("#dialog_duration_input").value = duration;
        document.querySelector("#dialog_location_input").value = location;
        //Set the type of the button to -1 to notify the eventlistener of dialog submit.
        confirmButton.submissionType = currLength;
        confirmButton.itemIndex = e.target.index;
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

        confirmButton.itemIndex = e.target.index;
      });

    form.reset(); 
}

//Function for editing the display information of items.
function editItemTexts(item, type, name, description, date, duration, location){
    for(const div of item.children){
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
                if(child.className.includes("item_title")){
                    let targetDate = new Date(date)

                    child.innerText = "Due on " + targetDate.toISOString().split('T')[0];
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

    var data = toDoItems[item.index];
    data.completed = true;

    // Make the AJAX POST request for edit existing item
    $.ajax(url + "api/todoitems/" + item.index, {
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data), // Convert the JavaScript object to a JSON string
      })
      .done(function (response) {
        // This function is called when the request is successful
        console.log(response);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // This function is called when the request fails
      console.log("Request failed: " + textStatus + ", " + errorThrown);
    });

    const newItem = item.cloneNode(true);
    completedItems.appendChild(newItem);
    item.parentNode.removeChild(item);
}

//If user clicked the complete button, remove the item
function clickRemoveOnList(event){
    console.log(event)
    const item = event.target.parentNode.parentNode.parentNode.parentNode;

    // Make the AJAX POST request for edit existing item
    $.ajax(url + "api/todoitems/" + item.index + "/delete", {
        method: "GET",
      })
      .done(function (response) {
        // This function is called when the request is successful
        console.log(response);
        delete toDoItems[item.index];
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // This function is called when the request fails
      console.log("Request failed: " + textStatus + ", " + errorThrown);
    });

    item.parentNode.removeChild(item);
    itemsList.slice(itemsList.indexOf(item), 1);
}


function clickWatch(event) {
    for(const icon of document.querySelector(".dialog_icons").children){
        icon.style.color = "black";
    }
    event.target.style.color = "#66A034";
}
    
function clickEat(event) {
    for(const icon of document.querySelector(".dialog_icons").children){
        icon.style.color = "black";
    }
    event.target.style.color = "#66A034";
}
    
function clickRead(event) {
    for(const icon of document.querySelector(".dialog_icons").children){
        icon.style.color = "black";
    }
    event.target.style.color = "#66A034";
}
    
function clickShop(event) {
    for(const icon of document.querySelector(".dialog_icons").children){
        icon.style.color = "black";
    }
    event.target.style.color = "#66A034";
}

initialize();
