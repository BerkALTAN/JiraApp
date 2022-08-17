const loadPanel = $('#loadPanel').dxLoadPanel({
    shadingColor: 'rgba(0,0,0,0.4)',
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    closeOnOutsideClick: false
}).dxLoadPanel('instance');

$('#tbJql').dxTextBox({ 
    placeholder: 'Enter JQL here...' 
});

$('#btnGetData').dxButton({
	stylingMode: 'contained',
	text: 'Get Data',
	type: 'default',
	width: "100%",
	icon: 'search',
	onClick() {
		loadPanel.show();
		var jql = $('#tbJql').dxTextBox("option", "value");

		AP.request('/rest/api/latest/search?jql=' + jql, {
			success: function(responseText){
				var data = JSON.parse(responseText);
				$('#dgData').dxDataGrid("option", "dataSource", data.issues);

				loadPanel.hide();
			}
		});
	},
});

$('#dgData').dxDataGrid({
    remoteOperations: false,
    searchPanel: {
      visible: true,
      highlightCaseSensitive: true,
    },
    allowColumnReordering: true,
    rowAlternationEnabled: true,
    showBorders: true,
    groupPanel: {
      visible: true,
    },
    sorting: {
      mode: 'multiple',
    },
    filterRow: {
      visible: true,
      applyFilter: 'auto',
    },
    columnChooser: {
      enabled: true,
	  allowSearch: true,
	  height: 500
    },
	height: '600',
	toolbar: {
		items: [
			{
				location: 'before',
          		widget: 'dxButton',
				options: {
					icon: 'download',
					onClick() {
					  	dataGrid.refresh();
					},
				},
			},
			{
				location: 'before',
          		widget: 'dxButton',
				options: {
					icon: 'save',
					onClick() {
					  	dataGrid.refresh();
					},
				},
			},
			{
				location: 'after',
          		widget: 'dxButton',
				options: {
					icon: 'datafield',
					onClick() {
						puSummary.show();
					},
				},
			},
			'columnChooserButton',
			'searchPanel'
		]
	},
    columns: [
		{
			dataField: "id",
			caption: "ID"
		},
		{
			dataField: "key",
			caption: "Key"
		}
    ],
});

var puSummary = $('#puSummary').dxPopup({
    width: 300,
    height: 480,
    showTitle: true,
    title: 'Summary Items',
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
    showCloseButton: true,
    toolbarItems: [{
		widget: 'dxButton',
		toolbar: 'bottom',
		location: 'before',
		options: {
			icon: 'add',
			text: 'Add',
			onClick() {
				
			},
      	},
    }, 
	{
      	widget: 'dxButton',
		toolbar: 'bottom',
		location: 'after',
		options: {
        	text: 'Close',
			onClick() {
				puSummary.hide();
			},
      },
    }],
	contentTemplate() {
		var listView = $('<div />');
		listView.dxList({
			dataSource: columns,
			height: 320,
			showSelectionControls: true,
			selectionMode: 'all',
			displayExpr: "caption",
			keyExpr: "dataField",
			searchExpr: "caption",
			searchEnabled: true,
			onSelectionChanged: function(e) {
				const addedItems = e.addedItems;
				const removedItems = e.removedItems;

				let totalItems = [];
				addedItems.forEach(function (r) {
					totalItems.push({
						column: r.dataField,
						summaryType: 'sum'
					});
				});

				$('#dgData').dxDataGrid({
					summary: {
						totalItems: totalItems
					}
				});
			}
		}).dxList('instance');
		return listView;
	}
}).dxPopup('instance');

var summaries = [];
var columns = [];
columns.push({ dataField: "id", caption: "ID" });
columns.push({ dataField: "key", caption: "Key" });

loadPanel.show();
AP.request('/rest/api/3/field', {
	success: function(responseText){
		var data = JSON.parse(responseText);

		data.forEach(function (r) {
			let dataType = "string";
			if (r.schema) {
				if (r.schema.type == "string" || r.schema.type == "number" || r.schema.type == "date" || r.schema.type == "boolean" || r.schema.type == "datetime"){
					dataType = r.schema.type;
				}

				$('#dgData').dxDataGrid("addColumn", {
					dataField: "fields." + r.key,
					caption: r.name,
					visible: false,
					dataType: dataType
				});
				
				columns.push({ dataField: "fields." + r.key, caption: r.name, dataType: dataType, checked: false });
			}
		});

		loadPanel.hide();
	}
});