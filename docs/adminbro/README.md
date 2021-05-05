# AdminBro Documentation (WIP)
AdminBro is an adminstration tool. The tool allows the app administrator and app developers to view and edit the data in the app database. 

### Helpful Links:
- [AdminBro Tutorial](https://adminbro.com/tutorial-installation-instructions.html)

## Setting up AdminBro
Pre-requisite: Create an account in the VitaPrayer app

1. Open MySQLWorkbench
2. Open the User table
3. Set 'Role_Id' to '1' which represents Admin
4. Save the edits

## Using AdminBro
Run the following commands in the terminal:

```
cd server
node index.js
```
1. Go to: localhost:8080/admin
2. Log in to AdminBro with an account with an 'Admin' role. 

The tables are divided into developer tables and administrator tables. Developer tables are the tables that only developers would need to access. Administrator tables are the only tables that the app administrator would need to access. 

To access the data in a table, click on the name of the table you would like to view. To edit data, hover over the 3 dots at the end of the row and click 'Edit'. **Remember to hit save after editing a record** 

The 'Filter' function in especially helpful for looking through large tables like 'Sections' to find what you're looking for. You can apply more than one filter at a time to narrow down the results.

To export a table, click 'Export'. 

To import data to a table, click 'Import'. *** Feature does not currently work ***

## Coding AdminBro

The bulk of the AdminBro code is in [server/index.js](server/index.js)

### Models 
AdminBro requires Sequelize models of every table in order to work. Lines 30-40 are commented out. This section of code will make models for every table in the database. **However**, the foreign keys in the models will not be correct. The current models are correct. If you need to create a new table, you can write it by hand based on the existing tables or try your hand at debugging the auto-generated models. 

### Tables
Each table is called a 'resource'. Each resource has various options. 

* Parent: defines the sidebar group that the table should belong to 

### Login Authentication
The authentication process uses the same usernames and passwords as the app. However, the user must have the correct role ID to view AdminBro. This makes it so that no one can stumble upon the app data. 


### Creating Features or New Actions
The documentation on how to create features and actions is lacking in comparison to how much AdminBro advertises this benefit... This is what I have found so far. 

Helpful links: 

* [Customize Actions](https://adminbro.com/tutorial-actions.html)
* [Writing Your Own Components](https://adminbro.com/tutorial-writing-react-components.html)

The Export functionality is a good example of adding a new action. Customizing the AdminBro dashboard is done in [server/index.js](server/index.js) 

```
{ resource: db.Role, options: { 
			parent: sidebarGroups.developer,
			actions: {
				export: {
					actionType: 'resource',
					icon: 'Export',
					isVisible: true,
					handler: async (request, response, data) => {exportToCSV(response, data)},
					component: false
				}
			},
		}},		
```
About the code:

* db.Role: The table being referenced
* export: The name of the new action
* actionType: Will the action effect the resource, record, or entire database? Here, the export action will only apply to the resource
* icon: Find icons [here](https://www.carbondesignsystem.com/guidelines/icons/library/)
* handler: Passes the response and data to the exportToCSV function found in the index.js file
* component: Set to false because using the exportToCSV function instead of 
		