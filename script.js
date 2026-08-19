const input = document.getElementById("taskInput");
const add_Button =document.getElementById("addButton");
const list =document.getElementById("listTasks");
const  category_selector = document.getElementById("categorySelector");
const deadline_input = document.getElementById("deadline");
const searchInput = document.getElementById("searchInput");
const timer_displayer=document.getElementById("timer_displayer");
const timer_mood=document.getElementById("timer_mood");
const start_timer=document.getElementById("start_timer");
const pause_timer= document.getElementById("pause_timer");
const reset_timer=document.getElementById("reset_timer");
const exportbtn=document.getElementById("exportbtn");



const work_time=25 * 60;
const rest_time=5 * 60;

let time_left=work_time;
let isWorkmood=true;
let timeInterval=null;


function  Update_Display()
{
    let minutes= Math.floor(time_left / 60);
    let seconds= time_left % 60;


    let minutesStr=String(minutes).padStart(2,"0");
    let secondsStr =String(seconds).padStart(2, "0");


    timer_displayer.textContent=`${minutesStr}:${secondsStr}`;

}


function tick()
{
    if(time_left <=0)
    {
        switchMood();
        return;
    }

    time_left--;

    Update_Display();

}
function switchMood()
{

    isWorkmood =!isWorkmood;
    time_left = isWorkmood ? work_time : rest_time;
    timer_mood.textContent=isWorkmood ? "Work time" : "Break time";
    Update_Display();

    alert(isWorkmood ? "Break's over. Bak to work." : "Time for a short break");

}

start_timer.addEventListener("click", function ()
{
    if(timeInterval != null) return;
    timeInterval =setInterval(tick,1000)
});

pause_timer.addEventListener("click" , function ()
{
    clearInterval(timeInterval);
    timeInterval =null;
});

reset_timer.addEventListener("click", function ()
{
    clearInterval(timeInterval);
    timeInterval=null;
    isWorkmood =true;
    time_left=work_time;
    timer_mood.textContent ="work_time";
    Update_Display();
});

Update_Display();

let list_of_task = (JSON.parse(
        localStorage.getItem("list_of_task")))
        || [] ;
list_of_task = list_of_task.map(task => ({
    text : task.text,
    compelet : task.complete,
    category : task.category || "general",
    dealine : task.deadline || ""
}));



add_Button.addEventListener("click" , main_func);
input.addEventListener("keydown", enterfunc);
function enterfunc(event)
{
    if(event.key === "Enter")
    {
        main_func();
    }
}

function savetask()
{
    localStorage.setItem("list_of_task" , JSON.stringify(list_of_task));
}

searchInput.addEventListener("input", function ()
{
    rendertask();
});


function rendertask()
{
    list.innerHTML = "";

        let searchTerm=searchInput.value.trim().toLowerCase();
        let filterTasks=list_of_task.filter(task =>
        task.text.toLowerCase().includes(searchTerm));

        if (filterTasks.length === 0) {
        let emptyMsg = document.createElement("li");
        emptyMsg.textContent = "No tasks found.";
        list.appendChild(emptyMsg);
        return;
    }

        filterTasks.forEach((task) => {
        let realIndex =list_of_task.indexOf(task);
        createTaskElement(task,realIndex);
        });
}

function  createTaskElement(task,index)
{
        let li = document.createElement("li");
        let tickbox = document.createElement("input");
        let span = document.createElement("span");
        let delbutton = document.createElement("button");
        let editbutton = document.createElement("button");
        let categoryTag=document.createElement("span");
        let deadlineTag=document.createElement("span");

        tickbox.type="checkbox";
        tickbox.checked = task.complete;

        span.textContent = task.text;
        if(task.complete)
        {
            span.style.textDecoration = "line-through";
        }

        categoryTag.textContent=task.category;
        categoryTag.classList.add("category_tag");

        if(task.deadline)
        {
            deadlineTag.textContent = task.deadline;
            deadlineTag.classList.add("deadline_tag");
            let today = new Date().toISOString().split("T")[0];
            if(task.deadline < today && !task.complete)
            {
                deadlineTag.classList.add("overdue");
            }
        }



        editbutton.textContent = "Edit";
        editbutton.addEventListener("click", function ()
            {
                let editInput =document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;

                li.replaceChild(editInput , span);
                editInput.focus();

                function saveedit()
                {
                    let new_text =editInput.value.trim();
                    if(new_text ==="")
                    {
                        alert("input can't be empty.");
                        return;
                    }

                    list_of_task[index].text=new_text;
                    savetask();
                    rendertask();
                }
                editInput.addEventListener("keydown", function (event)
                {
                    if(event.key==="Enter")
                    {
                        saveedit();
                    }
                });

                editInput.addEventListener("blur", saveedit);


            }
        )

         delbutton.textContent = "del";

        tickbox.addEventListener("change" , function ()
       {
           list_of_task[index].complete = tickbox.checked;
           savetask();
           span.style.textDecoration = tickbox.checked ? "line-through" : "none";


       });




        delbutton.addEventListener("click", function ()
        {
            list_of_task.splice(index , 1);
            savetask();
            rendertask();
        });




        li.appendChild(tickbox);
        li.appendChild(span);
        li.appendChild(editbutton);
        li.appendChild(delbutton);
        li.appendChild(categoryTag);
        li.appendChild(deadlineTag);
        list.appendChild(li);
}

exportbtn.addEventListener("click" , function ()
{
    let datastr=JSON.stringify(list_of_task, null ,2);
    let blob= new Blob([datastr] ,{ type : "application/JSON"});
    let fileURl=URL.createObjectURL(blob);


    let link=document.createElement("a");
    link.href = fileURl;
    link.download ="task.json";


    link.click();
    URL.revokeObjectURL(fileURl);
});

function main_func()
{
    if(input.value.trim() === "")
    {
        alert("input can't be empty.");
        return;
    }

    let task = { text : input.value.trim() , complete : false , category : category_selector.value , deadline :deadline_input.value};
    list_of_task.push(task);
    savetask();
    rendertask();

    input.value = "";
    deadline_input.value ="";
    input.focus();
}
rendertask();
