function pageLoad() {
    let qs = getQueryStringParameters();
    let id = Number(qs["id"]);
    let listHTML = ``;
    fetch('/Item/get/' + id, {method: 'get'}
    ).then(response => response.json()
    ).then(lists => {
        for (let list of lists) {
            listHTML += `<h1 style="text-align: center;">${list.ItemName}</h1>` +
                `<p style="display: none;" ${list.ItemID}</p>`+
                `<p style="font-size: 20px">Price: &pound${list.Price}</p>`+
                `<p style="font-size: 20px">Quantity: ${list.Quantity}</p>`+
                `<button id="BUY"><a href="${list.URL}">BUY</a></button>`+
                `<button class='editButton' data-id='${list.ItemID}'>Edit</button>` +
                `<button class='deleteButton' data-id='${list.ItemID}'>Delete</button>`;

        }
        document.getElementById("list").innerHTML= listHTML;
        let editButtons = document.getElementsByClassName("editButton");
        for (let button of editButtons) {
            button.addEventListener("click", editList);
        }
        let deleteButtons = document.getElementsByClassName("deleteButton");
        for (let button of deleteButtons) {
            button.addEventListener("click", deletelist);
        }
    });
    document.getElementById("saveButton").addEventListener("click", saveEditlist);
    document.getElementById("cancelButton").addEventListener("click", cancelEditlist);
}

function editList(event) {
    const id = event.target.getAttribute("data-id");

    if (id === null){
        document.getElementById("editHeading").innerHTML = 'Add new list: ';

        document.getElementById("ItemID").value = '';
        document.getElementById("ItemName").value = '';
        document.getElementById("Price").value = '';
        document.getElementById("Quantity").value = '';
        document.getElementById("URL").value = '';

        document.getElementById("list").style.display = 'none';
        document.getElementById("editDiv").style.display = 'block';

    } else {
        fetch('/Item/get/' + id, {method: 'get'}
        ).then(response => response.json()
        ).then(lists => {

            if (lists.hasOwnProperty('error')) {
                alert(lists.error);
            } else {

                document.getElementById("editHeading").innerHTML = 'Editing ' + lists.ItemName + ':';

                document.getElementById("ItemID").value = id;
                document.getElementById("ItemName").value = lists.ItemName;
                document.getElementById("Price").value = lists.Price;
                document.getElementById("Quantity").value = lists.Quantity;
                document.getElementById("URL").value = lists.URL;


                document.getElementById("list").style.display = 'none';
                document.getElementById("editDiv").style.display = 'block';

            }
        });

    }
}

function saveEditlist(event) {

    event.preventDefault();

    if (document.getElementById("ItemName").value.trim() === '') {
        alert("Please provide a list name.");
        return;
    }
    if (document.getElementById("Price").value.trim() === '') {
        alert("Please provide the price of the item");
        return;
    }
    if (document.getElementById("Quantity").value.trim() === '') {
        alert("Please provide the quantity of the item.");
        return;
    }
    const id = document.getElementById("ItemID").value;
    const form = document.getElementById("listForm");
    const formData = new FormData(form);

    let apiPath = '';
    if (id === '') {
        apiPath = '/Item/add';
    } else {
        apiPath = '/Item/update';
    }

    fetch(apiPath, {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {

        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            document.getElementById("list").style.display = 'block';
            document.getElementById("editDiv").style.display = 'none';
            pageLoad();
        }
    });
}

function cancelEditlist(event) {

    event.preventDefault();

    document.getElementById("list").style.display = 'block';
    document.getElementById("editDiv").style.display = 'none';

}

function deletelist(event) {

    const ok = confirm("Are you sure?");

    if (ok === true) {

        let id = event.target.getAttribute("data-id");
        let formData = new FormData();
        formData.append("id", id);

        fetch('/Item/delete', {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {

                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                } else {
                    href="/client/WishList.html";
                }
            }
        );
    }
}