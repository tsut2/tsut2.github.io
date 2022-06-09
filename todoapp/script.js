document.oncontextmenu = () => { return false };
const elemMenu = document.getElementById("menu");

let tempListName = window.prompt("リスト名の入力");
const listName = tempListName !== null && tempListName.length > 0 ? tempListName : "default";

window.onload = () => {
	document.getElementById("header").textContent = listName;
	
	if (localStorage.getItem(listName) !== null) {
		const tasks = JSON.parse(localStorage.getItem(listName));
		for (const task of tasks) {
			// fixme: 重複してる
			let div = document.createElement("div");
			div.id = task[0];
			div.classList.add("selectable", "elem", "task", "data", task[1] ? "done" : null);
			div.textContent = task[2];
			div.addEventListener(
				"contextmenu",
				(event) => clickMenu(div, event)
			);
			document.getElementById("block_task").prepend(div);
		}
	}

	for (const elem of document.getElementsByClassName("elem")){
		elem.addEventListener("contextmenu", (event) => clickMenu(elem, event));
	}

	document.body.addEventListener("click", () => {
		elemMenu.style.display = "none";
	});
}

function genIdentifier(d = 16){
	let charList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		temp = "";
	for (let i = 0; i < d; i++) {
		temp += charList.charAt(Math.floor(Math.random() * charList.length));
	}
	return temp;
}

function mkMenu(text, func){
	let div = document.createElement("div");
	div.textContent = text;
	div.classList.add("selectable");
	div.onclick = func;
	elemMenu.appendChild(div);
}

function clickMenu(elem, mouseEvent){
	while(elemMenu.firstChild){
		elemMenu.removeChild(elemMenu.firstChild);
	}

	elemMenu.style.left    = mouseEvent.pageX + "px";
	elemMenu.style.top     = mouseEvent.pageY + "px";
	elemMenu.style.display = "block";

	if (elem.classList.contains("task")){ // todo: 分割
		if (elem.id !== "block_task"){
			mkMenu("編集", () => {
				const oldText = elem.textContent;
				const newText = window.prompt("", oldText)
				elem.textContent = newText !== null && newText.length > 0 ? newText : oldText;
			});
			mkMenu(elem.classList.contains("done") ? "未完了" : "完了", () => {
				elem.classList.toggle("done")
			});
			mkMenu("消す", () => {
				document.getElementById(elem.id).remove()
			});
			// mkMenu("deadline");
		}
		mkMenu("追加する", () => {
			let div = document.createElement("div");
			div.id = genIdentifier();
			div.classList.add("selectable", "elem", "task", "data");
			div.textContent = "new task";
			div.addEventListener(
				"contextmenu",
				(event) => clickMenu(div, event)
			);
			document.getElementById("block_task").prepend(div);
		});
		mkMenu("完了済を消す", () => {
			let count = 0, array = [];
			for (const e of document.getElementsByClassName("done")) {
				array[count++] = e;
			}
			if ( count > 0 && window.confirm("本当に消す?")) {
				for (const e of array.reverse()) {
					e.remove();
				}
			}
		});
		mkMenu("保存する", () => {
			let data = [];
			for (const e of document.getElementsByClassName("data")) {
				data.push([
					e.id,
					e.classList.contains("done"),
					e.textContent
				]);
			}
			localStorage.setItem(listName, JSON.stringify(data));
		});
		mkMenu("他のリスト", () => {
			window.location.reload();
		});
	}
	mouseEvent.preventDefault();
	mouseEvent.stopPropagation();
}

const test_setTasks = (c=32) => {
	let data=[];
	for (let i=0; i<c;i++){data.push([genIdentifier(),Math.random()>0.5,`testTask_${genIdentifier(8)}`])}
	localStorage.setItem(listName, JSON.stringify(data));
	window.alert(`リスト名:${listName}に${c}個\nリロードします`);
	window.location.reload();
}
