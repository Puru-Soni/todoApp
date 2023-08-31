function addTodo() {
	const [title, desc] = Array.from(document.querySelectorAll("input"));
	const options = {
		method: "POST",
		body: JSON.stringify({
			title: title.value,
			description: desc.value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	};
	fetch("http://localhost:3000/todos", options)
		.then((data) => data.json())
		.then((res) => {
			const ul = document.querySelector(".todoItems");
			const li = document.createElement("li");
			li.innerHTML = `${res.title}::${res.description} <button type=button id=${res.id} onclick=removeEl(${res.id})>remove</button>`;
			li.id = res.id;
			ul.appendChild(li);
		});
}

function removeEl(event) {
	fetch(`http://localhost:3000/todos/${event}`, {
		method: "DELETE",
	})
		.then((data) => data.json())
		.then((data) => {
			const delLi = document.getElementById(data.id);
			delLi.remove();
		});
}

// runs when page is loaded first time
function keepUpdated() {
	fetch("http://localhost:3000/todos", {
		method: "GET",
	})
		.then((data) => data.json())
		.then((res) => {
			const ul = document.querySelector(".todoItems");
			ul.innerHTML = res
				.map((el) => {
					return `
				<li id=${el.id}>
					${el.title}::${el.description} 
					<button
						type=button
						id=${el.id} 
						onclick=removeEl(${el.id})
					>
						remove
					</button>
				</li>
			`;
				})
				.join("");
		});
}
keepUpdated();
