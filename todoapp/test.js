const testMkLS=()=>{
	const lists = [
		"List:foo",  "List:bar",
		"List:bruh", "List:hoge",
		"List:fuga", "List:piyo"
	];

	localStorage.setItem("listNames", JSON.stringify(lists));

	for (const list of lists) {
		const data = [];

		for (let i=0; i++<10;) {
			data.push([
				Math.floor(10*Math.random()).toString(),
				Math.random() < 0.5,
				0
			]);
		}
		localStorage.setItem(list, JSON.stringify(data));
	}

	alert("reload");
	location.reload();
}
function clearAll(){
	removeChildren("block_list");
	removeChildren("block_task");
	localStorage.clear()
	location.reload();
}
