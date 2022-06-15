const elementMenu = document.getElementById("menu");
let currentList = null;
document.oncontextmenu=()=>{return false};
window.onload=()=>{
	loadLists();

	// if (Notification.permission === "default"){
	// 	Notification.requestPermission().then((result) => {
	// 		console.log(result);
	// 	});
	// }

	setInterval(()=>{
		for (const elem of document.getElementsByClassName("task")){
			const now = Date.now();
			if(elem.dataset.deadline !== "0" && !elem.classList.contains("expired") && parseInt(elem.dataset.deadline) < now){
				elem.classList.add("expired");
			}
		}

		// if (window.Notification && Notification.permission === "granted"){
		// 	let n = new Notification(
		// 		"title", {body: "期限切れ"}
		// 	);
		// }

		save();
	},100);

	document.addEventListener("contextmenu", (event)=>menu(event));
	document.addEventListener("click", ()=>{
		elementMenu.style.display = "none";
	});
}
function genIdentifier(digit=16){
	const charList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-"
	let temp = "";
	for (let i = 0; i < digit; i++) {
		temp += charList.charAt(Math.floor(Math.random() * charList.length));
	}
	return temp;
}
function loadLists(){
	const data = JSON.parse(localStorage.getItem("listNames"));

	if (data !== null){
		let firstListName = null;
		for (const datum of data) {
			if (firstListName === null || firstListName.length === 0){
				firstListName = datum;
			}
			mkList(datum);
		}
		return firstListName;
	} else {
		const data_l = ["説明"];
		const data_t = [
			["左にあるのはリストです", false, 0],
			["クリックでリストを開きます", false, 0],
			["右にあるのはタスクです", false, 0],
			["クリックで完了済みに切り替えます", false, 0],
			["完了済みになると色が変わります", true, 0],
			["もう一度クリックすることで未完了に戻せます", false, 0],
			["右クリックでメニューを開きます", false, 0],
			["リストの追加, 編集などを行えます", false, 0]
		];

		localStorage.setItem("listNames", JSON.stringify(data_l));
		localStorage.setItem("L説明", JSON.stringify(data_t));

		loadTasks(loadLists());

		currentList="説明";
		document.getElementsByClassName("list")[1].classList.add("open");
	}
}
function loadTasks(key){
	removeChildren("block_task");
	currentList = key;

	const data = JSON.parse(localStorage.getItem("L"+key));

	if (data !== null) {
		for (const datum of data) {
			mkTask(datum[0], datum[1], datum[2]);
		}
	}
}
function openList(elem){
	save();

	for (const argument of document.getElementsByClassName("open")){
		argument.classList.remove("open");
	}

	elem.classList.add("open");
	loadTasks(elem.textContent);
}
function removeList(elem){
	if (window.confirm(elem.textContent + "を消しますか?")) {
		elem.remove();
		if (elem.textContent === currentList) {
			removeChildren("block_task");
		}
		localStorage.removeItem("L"+elem.textContent);
	}
}
function mkList(name){
	const div = document.createElement("div");
	div.textContent = name;
	div.id = "L"+genIdentifier();

	div.classList.add("list", "selectable");

	div.addEventListener("click", ()=>openList(div));

	document.getElementById("block_list").appendChild(div);
}
function mkTask(text, isDone, deadline){
	const div = document.createElement("div");
	div.textContent = text;

	div.id = "T"+genIdentifier();
	div.classList.add("task", "selectable");
	if (isDone){ div.classList.add("done")}
	div.dataset.deadline = deadline;

	div.addEventListener("click", ()=>{div.classList.toggle("done")});
	// div.addEventListener("contextmenu", (e)=>taskMenu(e, div.id));

	document.getElementById("block_task").appendChild(div);
}
function removeChildren(targetId){
	const elem = document.getElementById(targetId);
	while(elem.firstChild){
		elem.removeChild(elem.firstChild);
	}
}
function newList(){
	const name = prompt("新規リスト名: 変更できません", "新規リスト");
	let   lists = [];

	for (const nameElement of document.getElementsByClassName("list")) {
		lists.push(nameElement.textContent);
	}

	if (name === null || name.length === 0) {
		alert("リスト名が空です");
	} else if (lists.includes(name)) {
		alert(name + " は存在しています");
	} else {
		mkList(name);
	}
}
function removeTask(clickedElem){
	clickedElem.remove();
}
function editTask(clickedElem){
	const temp = window.prompt("", clickedElem.textContent);
	clickedElem.textContent = temp !== null && temp.length > 0 ? temp : clickedElem.textContent
}
function setDeadlineTask(clickedElem){
	const now = new Date();
	const time = new Date(
		parseInt(window.prompt("FullYear", now.getFullYear().toString())) % 9999,
		parseInt(window.prompt("Month", (now.getMonth()+1).toString()))-1 % 12,
		parseInt(window.prompt("Date", now.getDate().toString())) % 31,
		parseInt(window.prompt("Hours", now.getHours().toString())) % 24,
		parseInt(window.prompt("Minutes", now.getMinutes().toString())) % 60,
		parseInt(window.prompt("Seconds", now.getSeconds().toString())) % 60
	);

	clickedElem.dataset.deadline = time.getTime() > Date.now() ? time.getTime().toString() : 0;
	clickedElem.classList.remove("expired");

	// let time = window.prompt(
	// 	"時間を入力",
	// 	date.toLocaleDateString() + "-" + date.toLocaleTimeString()
	// );
	// if (time !== null){
	// 	clickedElem.dataset.deadline = time;
	// 	alert(time);
	// } else {
	// 	alert("異常値です");
	// }
}
function newTask(){
	const temp = window.prompt("", "新規タスク");
	mkTask(temp !== null && temp.length > 0 ? temp : "新規タスク", false, 0);
}
function removeCompletedTask(){
	let count = 0, array = [];
	for (const e of document.getElementsByClassName("done")) {
		array[count++] = e;
	}
	if ( count > 0 && window.confirm("本当に消す?")) {
		for (const e of array.reverse()) {
			e.remove();
		}
	} else {
		alert("完了しているものがありません");
	}
}
function save(){
	let lists = [], tasks = [];

	if (document.getElementById("block_list").children.length !== 0) {
		for (const list of document.getElementById("block_list").children) {
			lists.push(list.textContent);
			localStorage.setItem("listNames", JSON.stringify(lists));
		}
	}

	if (document.getElementById("block_task").children.length !== 0) {
		for (const task of document.getElementById("block_task").children) {
			tasks.push([task.textContent, task.classList.contains("done"), task.dataset.deadline]);
		}
		localStorage.setItem("L"+currentList, JSON.stringify(tasks));
	}
}
function showDeadlineTask(clickedElem){
	let time = new Date(parseInt(clickedElem.dataset.deadline));
	alert(time.toLocaleDateString()+"-"+time.toLocaleTimeString());
}
function menu(event){
	const clickedElem = event.composedPath()[0];
	const addMenu=(text, func)=>{
		let div = document.createElement("div");
		div.textContent = text;
		div.classList.add("selectable");
		div.addEventListener("click", func);
		elementMenu.appendChild(div);
	}

	removeChildren(elementMenu.id);
	elementMenu.style.left    = event.pageX+"px";
	elementMenu.style.top     = event.pageY+"px";
	elementMenu.style.display = "block";

	if (clickedElem.classList.contains("list")){
		if (clickedElem.id !== "block_list"){
			addMenu("開く", ()=>openList(clickedElem));
			if (document.getElementsByClassName("list").length > 2){
				addMenu("削除", ()=>removeList(clickedElem));
			}
			// addMenu("リスト名変更", ()=>renameList(clickedElem));
		}

		addMenu("新規リスト", newList);
	} else
	if (clickedElem.classList.contains("task")){
		if (clickedElem.id !== "block_task"){
			addMenu(clickedElem.classList.contains("done") ? "未完了" : "完了", ()=>{
				clickedElem.classList.toggle("done")
			});
			addMenu("期限", ()=>setDeadlineTask(clickedElem));
			addMenu("期限の確認", ()=>showDeadlineTask(clickedElem));
			addMenu("削除", ()=>removeTask(clickedElem));
			addMenu("編集", ()=>editTask(clickedElem));
		}
		if (currentList !== null) {
			addMenu("新規タスク", newTask);
			addMenu("完了済みを削除", removeCompletedTask);
		}
	} else {elementMenu.style.display = "none"}

	// addMenu("保存", ()=>save());
}
