function pageLoad() {
    let qs = getQueryStringParameters();
    let id = Number(qs["id"]);
    let listsHTML = `<table style="width:100%">` +
        '<tr>' +
        '<th style="text-align: left;" class="ID">ItemID</th>' +
        '<th style="text-align: left;">ItemName</th>' +
        '<th style="text-align: left;">Quantity</th>' +
        '<th style="text-align: left;">MarkedUserID</th>' +
        '<th style="text-align: left;" class="last">Options</th>' +
        '</tr>';

    fetch('/ListItem/get/' + id, {method: 'get'}
    ).then(response => response.json()
    ).then(lists => {
        for (let list of lists) {

            listsHTML += `<tr>` +
                `<td class="ID">${list.ItemID}</td>` +
                `<td id="things">${list.ItemName}</td>` +
                `<td>${list.Quantity}</td>` +
                `<td>${list.MarkedUserID}</td>` +
                `<td class="last">` +
                `<button class='editButton' data-id='${list.ListID}'>Edit</button>` +
                `<button class='deleteButton' data-id='${list.ListID}'>Delete</button>` +
                `</td>` +
                `</tr>`;

        }

        listsHTML += '</table>';

        document.getElementById("listDiv").innerHTML = listsHTML;

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

        document.getElementById("ListID").value = '';
        document.getElementById("ListName").value = '';
        document.getElementById("Status").value = '';

        document.getElementById("listDiv").style.display = 'none';
        document.getElementById("editDiv").style.display = 'block';

    } else {
        fetch('/WishList/get/' + id, {method: 'get'}).
        then(response => response.json()).
        then(list => {
            if (list.hasOwnProperty('error')) {
                alert(list.error);
            } else {

                document.getElementById("editHeading").innerHTML = 'Editing' + list.ListName + ':';

                document.getElementById("ListID").value = id;
                document.getElementById("ListName").value = list.ListName;
                document.getElementById("Status").value = list.Status;

                document.getElementById("listDiv").style.display = 'none';
                document.getElementById("editDiv").style.display = 'block';

            }
        });
    }
}

function saveEditlist(event) {

    event.preventDefault();

    if (document.getElementById("ListName").value.trim() === '') {
        alert("Please provide a fruit name.");
        return;
    }
    if (document.getElementById("Status").value.trim() === '') {
        alert("Would you like the list to be private or public");
        return;
    }
    const id = document.getElementById("ListID").value;
    const form = document.getElementById("listForm");
    const formData = new FormData(form);

    let apiPath = '';
    if (id === '') {
        apiPath = '/WishList/add';
    } else {
        apiPath = '/WishList/update';
    }

    fetch(apiPath, {method: 'post', body: formData}
    ).then(response => response.json()
    ).then(responseData => {

        if (responseData.hasOwnProperty('error')) {
            alert(responseData.error);
        } else {
            document.getElementById("listDiv").style.display = 'block';
            document.getElementById("editDiv").style.display = 'none';
            pageLoad();
        }
    });
}

function cancelEditlist(event) {

    event.preventDefault();

    document.getElementById("listDiv").style.display = 'block';
    document.getElementById("editDiv").style.display = 'none';

}

function deletelist(event) {

    const ok = confirm("Are you sure?");

    if (ok === true) {

        let id = event.target.getAttribute("data-id");
        let formData = new FormData();
        formData.append("ListID", id);

        fetch('/WishList/delete', {method: 'post', body: formData}
        ).then(response => response.json()
        ).then(responseData => {

                if (responseData.hasOwnProperty('error')) {
                    alert(responseData.error);
                } else {
                    pageLoad();
                }
            }
        );
    }
}