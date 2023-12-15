import { useState, useEffect } from 'react';
import { Stack, Button, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, IconButton, Divider, TextField } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { URGENCY } from '../Enums/UrgencyEnum';

export default function TODO() {

    const defaultTodoListObject = [
        {
            "name": "Get iCommand dev running properly",
            "Urgency": "Today",
            "dateDue": null,
            "dateAdded": "Tue, 11 Nov 2023 12:30:00 MDT"
        },
        {
            "name": "Look ahead at another project and get it's environment running",
            "Urgency": "This Week",
            "dateDue": null,
            "dateAdded": "Tue, 11 Nov 2023 12:30:00 MDT"
        },
        {
            "name": "Fry meatballs?",
            "Urgency": "Today",
            "dateDue": null,
            "dateAdded": "Tue, 11 Nov 2023 12:30:00 MDT"
        },
        {
            "name": "VIRTUAL DR APPT",
            "Urgency": "None",
            "dateDue": null,
            "dateAdded": "Tue, 11 Nov 2023 12:30:00 MDT"
        },
        {
            "name": "Christmas Shopping",
            "Urgency": "Specific Date",
            "dateDue": "Sat, 25 Dec 2023 00:00:00 MDT",
            "dateAdded": "Tue, 11 Nov 2023 12:30:00 MDT"
        }
    ]

    const defaultNewItem = {
        "name": null,
        "Urgency": URGENCY.NONE,
        "dateDue": null,
        "dateAdded": new Date().toLocaleDateString()
    }

    const [addingItem, setAddingItem] = useState(false)
    const [todo, setTodo] = useState(defaultTodoListObject)

    function urgencyMessage(item) {
        let secondaryText = item.Urgency
        if (secondaryText == "Specific Date")
            secondaryText = new Date(item.dateDue).toLocaleDateString()
        return (< Typography variant="subtitle2" >
            {secondaryText}
        </Typography >)

    }

    function markItemComplete(itemIndex) {
        removeItem(itemIndex)
    }

    function removeItem(itemIndex) {
        let newTodo = [...todo]
        removeByAttr(newTodo, "name", newTodo[itemIndex].name)
        setTodo(newTodo)
    }

    function removeByAttr(arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    }

    function AddItem() {
        const emptyItem = {
            "name": "",
            "Urgency": null,
            "dateDue": null,
            "dateAdded": null
        }

        const [newItem, setNewItem] = useState(emptyItem)

        function setItemName(newName) {
            let editedItem = { ...newItem }
            editedItem.name = newName
            setNewItem(editedItem)
        }

        function setItemUrgency(newUrgency) {
            let editedItem = { ...newItem }
            editedItem.Urgency = newUrgency
            setNewItem(editedItem)
        }

        function setItemDateDue(newDateDue) {
            let editedItem = { ...newItem }
            editedItem.dateDue = newDateDue
            setNewItem(editedItem)
        }

        function createNewItem() {
            setAddingItem(true)
            let editedItem = { ...newItem }
            editedItem.name = ""
            editedItem.Urgency = URGENCY.TODAY
            editedItem.dateAdded = new Date().toLocaleDateString()
            editedItem.dateDue = null
            setNewItem(editedItem)
        }

        function addItemToTODO() {
            let newToDo = [...todo]
            newToDo.push(newItem)
            setTodo(newToDo)
            setAddingItem(false)
        }

        return (
            <Stack direction="row">
                {addingItem ? (
                    <Stack direction="row">
                        <TextField
                            autoFocus={true}
                            id="outlined-required"
                            label="New Task"
                            value={newItem.name}
                            onChange={(e) => { setItemName(e.target.value)}}
                            sx={{ width: "100%", m: 'auto' }}
                        />

                        <IconButton onClick={addItemToTODO} edge="end" aria-label="delete" sx={{ m: 'auto' }}>
                            <AddIcon />
                        </IconButton>

                        <IconButton onClick={() => { setAddingItem(false) }} edge="end" aria-label="delete" sx={{ m: 'auto' }}>
                            <CancelIcon />
                        </IconButton>

                    </Stack>
                ) : (
                        <Button onClick={createNewItem} variant="contained" sx={{ m: 'auto' }}>
                        Add Item
                    </Button>)}

            </Stack>
        )
    }

    return (
        <Stack direction="column" sx={{ width: "75%", m: 'auto' }}>
            <List>
                {todo.map((item, itemIndex) => {
                    return (
                        <ListItem key={itemIndex} divider={true} sx={{ width: "100%", m: 'auto', backgroundColor: 'lightgreen', borderRadius: 2 }}>
                            <ListItemAvatar>
                                <ArrowRightIcon />
                            </ListItemAvatar>
                            <ListItemText secondary={urgencyMessage(item)} sx={{ width: "100%", m: 'auto' }}>
                                <TextField
                                    id="outlined-required"
                                    defaultValue={item.name }
                                    sx={{ width: "100%", m: 'auto' }}
                                />
                            </ListItemText>
                            <IconButton onClick={() => { markItemComplete(itemIndex) }}  edge="end" aria-label="delete" sx={{ m: 'auto' }}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={() => { removeItem(itemIndex) }} edge="end" aria-label="delete" sx={{ m: 'auto' }}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    )
                })}
            </List >
            <AddItem/>
        </Stack>
    )
}