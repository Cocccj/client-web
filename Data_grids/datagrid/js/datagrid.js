// Define the data grid and corresponding actions.
// Andrew ID: jiaqiz

// Constructor
function DataGrid(gridObject) {
	this.data = gridObject.data;
	this.rootElement = gridObject.rootElement;
	this.columns = gridObject.columns;
	this.pageSize = gridObject.pageSize;
	this.onRender = gridObject.onRender;
    this.table = document.createElement("table");
    this.sortedCol = 0;
    this.order = "ascending";
    this.currentPage = 1;
    this.keys = Object.keys(this.data[0]);
	var that = this;
	var header = this.table.createTHead();
    var rowH = header.insertRow(0);

    this.data.sort(function (a, b) { 
        // At the beginning, sorting the data by first column in ascending order.
    	if (a[that.keys[that.sortedCol]] < b[that.keys[that.sortedCol]]) return -1;
	    if (a[that.keys[that.sortedCol]] > b[that.keys[that.sortedCol]]) return 1;
	    return 0;
	});

    // Set the pager
    if (this.pageSize && this.data.length > this.pageSize) {
        var numPages = Math.ceil(this.data.length / this.pageSize);
        this.currentPage = 1;
        var pager = document.createElement("caption");
        pager.style.textAlign = "right";
        loadPager.call();
        this.table.appendChild(pager);
    }

    // Set the header and corresponding listeners.
    for (var col = 0; col < this.columns.length; col++) {
        for (var k = 0; k < this.keys.length; k++) {
            if (this.columns[col].dataName === this.keys[k]) {
                var cellH = rowH.insertCell(col);
                cellH.innerHTML = this.columns[col].name;
                cellH.style.textAlign = this.columns[col].align;
                cellH.style.width = this.columns[col].width;
                cellH.setAttribute("data-toggle", "tooltip");
                cellH.setAttribute("title", "Sort by " + this.columns[col].name);
                cellH.setAttribute("colNo", k);
                cellH.addEventListener(
                    "click",
                    this.sortListener.bind(this, cellH),
                    false
                );
                break;
            }
        }
    }

    if (this.pageSize && this.data.length > this.pageSize) {
        this.table.appendChild(pager);
    }
    this.table.appendChild(header);
    this.loadTableContent.call(this);

    this.rootElement.appendChild(this.table);

    // Function to load the pager
    function loadPager() {
        while (pager.lastChild) {
            pager.removeChild(pager.lastChild);
        }
        var prev = document.createElement("span");
        prev.innerHTML = "< previous";
        pager.appendChild(prev);
        var pages = document.createElement("span");
        pages.innerHTML = " " + that.currentPage + " of " + numPages + " ";
        pager.appendChild(pages);
        var next = document.createElement("span");
        next.innerHTML = "next >";
        pager.appendChild(next);
        if (that.currentPage <= 1) {
            prev.setAttribute("pageClick", "disabled");
        } else {
            prev.setAttribute("pageClick", "enabled");
            prev.addEventListener(
                "click",
                prevPage,
                false
            );
        }
        if (that.currentPage >= numPages) {
            next.setAttribute("pageClick", "disabled");
        } else {
            next.setAttribute("pageClick", "enabled");
            next.addEventListener(
                "click",
                nextPage,
                false
            );
        }
    }

    // Go to the previous page
    function prevPage() {
        that.currentPage = that.currentPage - 1;
        that.loadTableContent.call(that);
        loadPager.call();
    }

    // Go to the next page
    function nextPage() {
        that.currentPage = that.currentPage + 1;
        that.loadTableContent.call(that);
        loadPager.call();
    }
    
}

// Destroy method
DataGrid.prototype.destroy = function() {
    while(this.rootElement.lastChild) {
        this.rootElement.removeChild(this.rootElement.lastChild);
    }
}

// Clear table data rows
DataGrid.prototype.clearTableContent = function() {
    while(this.table.lastChild) {
        if (this.table.lastChild.getAttribute("data-row")) {
            this.table.removeChild(this.table.lastChild);
        } else {
            break;
        }
    }
}

// Load table rows data
DataGrid.prototype.loadTableContent = function() {
    this.clearTableContent.call(this);
    var startIndex = 0;
    if (this.pageSize && this.data.length > this.pageSize) {
        startIndex = this.pageSize * (this.currentPage - 1);
    }
    for (var i = 0; (i + startIndex) < this.data.length 
            && (!this.pageSize || i < this.pageSize); i++) {
        var row = document.createElement("tr");
        row.setAttribute("data-row", "data-row");
        for (var j = 0; j < this.columns.length; j++) {
            for (var k = 0; k < this.keys.length; k++) {
                if (this.columns[j].dataName === this.keys[k]) {
                    var cell = document.createElement("td");
                    cell.textContent = this.data[i + startIndex][this.keys[k]];
                    cell.style.textAlign = this.columns[j].align;
                    cell.style.width = this.columns[j].width + "px";
                    if(k == this.sortedCol) {
                        cell.setAttribute("selected", "selected");
                    }
                    row.appendChild(cell);
                    break;
                }
            }
        }
        this.table.appendChild(row);
    }
    if (this.onRender) {
        this.onRender.call();
    }
}

// Sort listener function
DataGrid.prototype.sortListener = function(cell) {
    // Sort the data in different ways based on the conditions.
    var col = cell.getAttribute("colNo");
    if (this.sortedCol == col && this.order == "ascending") {
        this.order = "descending";
    } else {
        this.sortedCol = col;
        this.order = "ascending";
    }

    var sort = function (a, b) {
        if (a[this.keys[col]] < b[this.keys[col]]) var result = -1;
        else if (a[this.keys[col]] > b[this.keys[col]]) result = 1;
        else result = 0;
        if (this.order == "ascending")   return result;
        else return -result;
    }

    this.data.sort(sort.bind(this));
    this.loadTableContent.call(this);
}
