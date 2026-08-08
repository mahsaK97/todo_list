const input = document.getElementById("taskInput");
const add_Button =document.getElementById("addButton");
const list =document.getElementById("listTasks");



let list_of_task = (JSON.parse(
        localStorage.getItem("list_of_task")))
        || [] ;



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

function rendertask()
{
    list.innerHTML = "";
    list_of_task.forEach((task , index) => {
        createTaskElement(task, index);
    });
}

function  createTaskElement(task,index)
{
        let li = document.createElement("li");
        let tickbox = document.createElement("input");
        let span = document.createElement("span");
        let delbutton = document.createElement("button");
        let editbutton = document.createElement("button");



        tickbox.type="checkbox";
        tickbox.checked = task.complete;

        span.textContent = task.text;
        if(task.complete)
        {
            span.style.textDecoration = "line-through";
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
        list.appendChild(li);
}

function main_func()
{
    if(input.value.trim() === "")
    {
        alert("input can't be empty.");
        return;
    }

    let task = { text : input.value.trim() , complete : false };
    list_of_task.push(task);
    savetask();
    rendertask();

    input.value = "";
    input.focus();
}
rendertask();
