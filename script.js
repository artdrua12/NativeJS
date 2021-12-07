let data = [{
    id: 1,
    string: 'str1',
    boolean: true,
    array: [1, 2, 3]
}, {
    id: 2,
    string: '2я строчка',
    boolean: false,
    array: ['яблоки', 'бананы', 'груши']
}, {
    id: 3,
    string: 'строка 3',
    boolean: true,
    array: ["Вася", "Коля", "Оля"]
},
{
    id: 4,
    string: 'Я он она вместе целая страна',
    boolean: true,
    array: ["текст", 12, 3, 90]
},
{
    id: 7,
    string: 'номер 7',
    boolean: false,
    array: ["семь", "восемь", "девять"]
},
{
    id: 5,
    string: 'Съешь этих мягких булочек да выпей чаю',
    boolean: false,
    array: ["c засечками", "без засечек", "по умолчанию"]
}]

let oldItemTable = {};
let oldNodeDom;

let proxyData = new Proxy(data, {
    set(target, prop, value) {
        target[prop] = value;
        addtoDomTable(value);
        return true
    },
    deleteProperty(target, obj) {
        delete target.splice(target.find(item => item == obj), 1);
        return true;
    },
});

window.onload = function () {
    for (let item of data) {
        addtoDomTable(item, data);
    }

    proxyData.push({
        id: 10,
        string: 'str100',
        boolean: true,
        array: [10, 20, 30]
    })
}

function addtoDomTable(data) {
    if (typeof data !== "object") return
    const element = document.querySelector('.table');
    let tr = document.createElement("tr");
    tr.append(tableLine(data));
    element.appendChild(tr);
}

function tableLine(item) {
    let line = new DocumentFragment();
    for (let i in item) {
        let td = document.createElement('td');
        td.innerHTML = item[i];
        line.append(td);
    }

    let tdChange = document.createElement('td');
    // tdChange.innerHTML = "<a href='#popap'><button onclick='change(this)'>редактировать</button></a>";
    tdChange.addEventListener('click', function () {
        window.popapForm[0].value = item.id;
        window.popapForm[1].value = item.string;
        window.popapForm[2].value = item.boolean;
        window.popapForm[3].value = item.array;

        oldItemTable = item;
        oldNodeDom = tdChange.parentNode;
    })
    tdChange.innerHTML = "<a href='#popap'><button>редактировать</button></a>";
    line.append(tdChange);

    let tdDelete = document.createElement('td');
    tdDelete.addEventListener('click', function () {
        tdDelete.parentNode.remove();
        delete proxyData[item];
    })
    tdDelete.innerHTML = "<button>удалить</button>";
    line.append(tdDelete)

    return line;
};

function add() {
    proxyData.push({
        id: window.addForm[0].value,
        string: window.addForm[1].value,
        boolean: window.addForm[2].value,
        array: window.addForm[3].value
    })
}

function search() {
    let paramertSearch = window.searchForm[0].value;

    let searchData = data.filter(item => {
        for (let key in item) {
            let str = Array.isArray(item[key]) ? item[key].join() : String(item[key]);
            if (str.indexOf(paramertSearch) != -1)
                return item
        }
    })
    updateDom(searchData);
}

function updateDom(searchData) {
    const element = document.querySelectorAll('tr');

    for (let i = 1; i < element.length; i++) {
        element[i].remove();
    }

    for (let i = 0; i < searchData.length; i++) {
        addtoDomTable(searchData[i]);
    }
}

function funConpare(sort, sortName) {
    if (sort == "asc") {
        return function compare(a, b) {
            return a[sortName] - b[sortName];
        }
    }
    return function compare(a, b) {
        return b[sortName] - a[sortName];
    }
}

function sort() {
    const sort = document.querySelector("[name='sort']:checked").value || "";
    const sortName = document.querySelector("[name='sortName']:checked").value || "";
    data.sort(funConpare(sort, sortName));
    updateDom(data);
}

function change() {
    oldItemTable.id = window.popapForm[0].value;
    oldItemTable.string = window.popapForm[1].value;
    oldItemTable.boolean = window.popapForm[2].value;
    oldItemTable.array = window.popapForm[3].value;

    let node = oldNodeDom.parentNode;
    let newNodeDom = document.createElement("tr");
    newNodeDom.append(tableLine(oldItemTable));
    node.replaceChild(newNodeDom, oldNodeDom);

    document.location.href = "#";
}
