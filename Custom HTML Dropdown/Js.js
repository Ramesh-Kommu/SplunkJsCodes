
require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'views/shared/results_table/renderers/BaseCellRenderer',
    'splunkjs/mvc/simplexml/ready!'
], function ($, _, mvc, BaseCellRenderer) {
    var service = mvc.createService({ owner: "nobody" });
    var defaultTokenModel = mvc.Components.get('default');
    var submittedTokenModel = mvc.Components.get("submitted");
    function setToken(token, value) {
        defaultTokenModel.set(token, value);
        submittedTokenModel.set(token, value);
    }
    function unsetToken(token) {
        defaultTokenModel.unset(token);
        submittedTokenModel.unset(token);
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css";
    document.head.appendChild(link);

    var searchQuery = '|inputlookup BotDetailsNew.csv|table Category |dedup Category';
    var searchResults = service.oneshotSearch(searchQuery, {
        count: 0,
        field_list: "Category"
    }, {
        exec_mode: "blocking"
    }, function (err, results) {
        if (results && results.rows && results.rows.length > 0) {
            const categoryData = results.rows;
            const categoryArray = categoryData.map(row => row[0]);
            generateListItems(categoryArray);
        }
    })
    const selectBtn = document.querySelector(".select-btn"),
        itemsContainer = document.querySelector(".list-items"),
        btnText = document.querySelector(".btn-text"),
        filterInput = document.getElementById("filterInput"),
        selectAllBtn = document.getElementById("selectAll"),
        clearAllBtn = document.getElementById("clearAll");

    function generateListItems(data) {
        data.forEach(itemText => {
            const item = document.createElement("li");
            item.classList.add("item");

            const checkbox = document.createElement("span");
            checkbox.classList.add("checkbox");
            const checkIcon = document.createElement("i");
            checkIcon.classList.add("fa-solid", "fa-check", "check-icon");
            checkbox.appendChild(checkIcon);

            const text = document.createElement("span");
            text.classList.add("item-text");
            text.innerText = itemText;

            item.appendChild(checkbox);
            item.appendChild(text);

            item.addEventListener("click", () => {
                item.classList.toggle("checked");
                updateButtonText();
            });

            itemsContainer.appendChild(item);
        });
    }

    function settingTokens(arr) {

        tokenvalue = '';
        if (arr.length == 0) {
            setToken('category', '*');
        }
        else {

            const tokenvalue = arr.join(",");
            console.log(tokenvalue);
            setToken('category', tokenvalue);
        }
    }

    function updateButtonText() {

        const checked = document.querySelectorAll(".checked");
        const checkedArray = Array.from(checked).map(item => `"${item.innerText}"`);
        console.log(checkedArray);
        settingTokens(checkedArray)
        btnText.innerText = checkedArray.length ? `${checkedArray.length} Selected` : "Category";
    }
    function filterItems() {
        const filterText = filterInput.value.toLowerCase();
        document.querySelectorAll(".item").forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(filterText) ? "flex" : "none";
        });
    }

    selectBtn.addEventListener("click", () => {

        selectBtn.classList.toggle("open");
        if (selectBtn.classList.contains("open")) {
            itemsContainer.style.display = "block";
        } else {
            itemsContainer.style.display = "none";
        }
    })

    filterInput.addEventListener("input", filterItems);

    selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".item").forEach(item => {
            item.classList.add("checked");
            item.style.display = "flex";
        });
        updateButtonText();
    });

    clearAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".item").forEach(item => {
            item.classList.remove("checked");
            item.style.display = "flex";
        });
        updateButtonText();
    });

    filterInput.addEventListener("input", () => {
        if (filterInput.value === "") {
            document.querySelectorAll(".item").forEach(item => item.style.display = "flex");
        }
    });

})