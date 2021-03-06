import React, {Fragment} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, TextField, Paper, IconButton, Tooltip, Fab} from '@material-ui/core';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch} from "react-redux";
import {IProductionTeam} from "types/model/production";
import {updateTeamItem} from "redux/actions/productionAction";


const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));

interface IProductionTeamItemProps {
    item: IProductionTeam;
    onDeleteItem: ((id: number) => void);
    onChangeEmployeeItem: ((id: number) => void);
    onChangeWorkItem: ((id: number) => void);
    canEdit: boolean;
}


const ProductionTeamItem = (props: IProductionTeamItemProps) => {
    const classes = useStyles()
    const {item, onDeleteItem, onChangeEmployeeItem, onChangeWorkItem, canEdit} = props
    const dispatch = useDispatch()

    const handleClickListItem = (id: number) => {
        onChangeEmployeeItem(id)
    }

    const handleClickChangeWorkItem = (id: number) => {
        onChangeWorkItem(id)
    }

    const handleClickDeleteItem = (id: number) => {
        onDeleteItem(id);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newItem = {...item, [event.target.name]: event.target.value};
        dispatch(updateTeamItem(newItem))
    }

    return (
        <Fragment>
            <Grid item xs={4}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="??????????????????"
                        name="unit"
                        value={item.employee.fio}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickListItem(item.id)
                                        }}>
                                <MenuOpenIcon/>
                            </IconButton>
                        ) : null
                    }
                </Paper>
            </Grid>
            <Grid item xs={3}>
                <Paper elevation={0} className={classes.paper_root}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        label="?????? ????????????"
                        name="work"
                        value={item.work.name}
                    />
                    {
                        canEdit ? (
                            <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                        onClick={event => {
                                            handleClickChangeWorkItem(item.id)
                                        }}>
                                <MenuOpenIcon/>
                            </IconButton>
                        ) : null
                    }
                </Paper>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="dt_periodStart"
                    label="???????????? ??????????"
                    type="datetime-local"
                    defaultValue={item.periodStart}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name="periodStart"
                />

            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="dt_periodEnd"
                    label="???????????? ??????????"
                    type="datetime-local"
                    defaultValue={item.periodEnd}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name="periodEnd"
                />
            </Grid>
            {canEdit ? (
                <Grid item>
                    <Tooltip title={'?????????????? ????????????'}>
                        <Fab color="secondary" aria-label="add" onClick={event => handleClickDeleteItem(item.id)}>
                            <DeleteIcon/>
                        </Fab>
                    </Tooltip>
                </Grid>
            ) : null
            }
        </Fragment>
    )
}

export default ProductionTeamItem
