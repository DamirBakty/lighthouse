import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Tooltip,
    Paper,
    Fab,
    Typography,
    IconButton
} from '@material-ui/core';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    loadFormulaItem,
    changeFormula,
    updateFormula,
    addNewFormula,
    deleteRawItem,
    addNewRawItem
} from "redux/actions/formulaAction";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from '@material-ui/icons/Add';
import OpacityIcon from '@material-ui/icons/Opacity';
import CircularIndeterminate from "components/Loader/Loader";
import {loadProduct} from "redux/actions/productAction";
import { useConfirm } from "material-ui-confirm";
import FormulaRawItem from "../components/FormulaRawItem";
import {loadRaws} from "redux/actions/rawAction";
import {useDialog} from "components/SelectDialog";
import {IRawInFormula} from "types/model/formula";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES, NEW_RECORD_TEXT,
    NEW_RECORD_VALUE
} from "utils/AppConst";
import {showInfoMessage} from "redux/actions/infoAction";
import {RoundValue} from "../../../utils/AppUtils";
import {IStateInterface} from "../../../redux/rootReducer";
import {loadUnit} from "../../../redux/actions/unitAction";

interface IFormulaItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const FormulaItem = (props: IFormulaItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const confirm = useConfirm()
    const paramId = props.match.params.id
    const formulaId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId)
    const { className, ...rest } = props

    const selectDialog = useDialog()
    const formulaItem  = useSelector((state: IStateInterface)=> state.formula.formulaItem)
    const isLoading = useSelector((state: IStateInterface) => state.formula.isLoading)
    const productItems = useSelector((state: IStateInterface) => state.product.products)
    const rawItems = useSelector((state: IStateInterface) => state.raw.raws)
    const unitItems = useSelector((state: IStateInterface) => state.unit.unitItems)

    const [hasProductError, setProductError] = useState(false)
    const [hasCountError, setCountError] = useState(false)
    const [hasNoItemsError, setNoItemError] = useState(false)

    /**
     * ?????????????????? ???????????????? ??????????????????????
     * @param event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...formulaItem, [event.target.name]: event.target.value};
        dispatch(changeFormula(item))
    };

    /**
     * ?????????????? ??????????????????
     */
    const handleChangeProduct = () => {
        selectDialog(
            {
                title: '?????????? ??????????????????',
                description: '',
                confirmationText:'??????????????',
                cancellationText: '????????????????',
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...formulaItem};
                item.product.id = value.id;
                item.product.name = value.name;
                dispatch(changeFormula(item));
                setProductError(false)
            }
        );
    };


    /**
     * ?????????? ?? ?????????????????? ???????????? ?? ????. ??????????????????
     * @param id
     */
    const handleChangeUnitItem = (id: number)=>{
        selectDialog(
            {
                title: '?????????? ????. ??????????????????',
                description: '',
                confirmationText:'??????????????',
                cancellationText: '????????????????',
                dataItems: unitItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...formulaItem};
                const index = item.raws.findIndex((item: IRawInFormula) => {return item.id === id})
                item.raws[index].unit.id = value.id;
                item.raws[index].unit.name = value.name;
                dispatch(changeFormula(item));
            }
        );
    };

    /**
     * ?????????? ?? ?????????????????? ???????????? ?? ????????????
     * @param id
     */
    const handleChangeRawItem = (id: number)=>{
        selectDialog(
            {
                title: '?????????? ??????????',
                description: '',
                confirmationText:'??????????????',
                cancellationText: '????????????????',
                dataItems: rawItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...formulaItem};
                const index = item.raws.findIndex((item: IRawInFormula) => {return item.id === id})
                item.raws[index].raw.id = value.id;
                item.raws[index].raw.name = value.name;
                dispatch(changeFormula(item));
            }
        );
    };

    /**
     * ???????????????? ?????????? ???? ????????????
     * @param id
     */
    const handleDeleteRawItem = (id: number)=>{
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
            ).then(() =>
            dispatch(deleteRawItem(id))
        )
    };

    /**
     * ???????????????????? ???????????? ?????????? ?? ??????????????????
     */
    const handleAddNewRawItem = () => {
        setNoItemError(false)
        dispatch(addNewRawItem())
    };

    /**
     * ?????????????????????? ??????????????????
     */
    const handleCalculation = () => {
        const formula = {...formulaItem}
        const workItems = formula.raws.filter((item:IRawInFormula) => item.substance !== 0)
        if (workItems.length === formula.raws.length) {
            dispatch(showInfoMessage('info', '???????????? ??????????????!'))
            return
        }
        if (formulaItem.raws.length - workItems.length > 1) {
            dispatch(showInfoMessage('info', '?????????????? ?????????? ??????????????????????!'))
            return;
        }
        formula.raws = formula.raws.map((item: IRawInFormula) => {
            if (item.substance !== 0){
                item.raw_value = +(item.substance * 100 / item.concentration).toFixed(1)
            }
            return item
        })
        const components_substance = workItems.reduce((acc: number, curr: IRawInFormula) => acc + curr.substance * 100 / curr.concentration, 0);
        formula.raws = formula.raws.map((item: IRawInFormula) => {
            if (item.substance === 0) {
                item.raw_value = RoundValue((formula.density * formula.calcAmount) - +components_substance.toFixed(1));
            }
            return item
        })
        dispatch(changeFormula(formula))
    };

    /**
     * ???????????????? ???????????????????????? ??????????
     */
    function isValid() {
        const hasProduct = formulaItem.product.id > 0
        const hasCalcAmount = formulaItem.calcAmount > 0
        const hasRawItems = formulaItem.raws.length > 0
        const hasIncorrectRawValues = formulaItem.raws.filter((item:IRawInFormula) => item.raw.id === 0).length === 0
        const hasIncorrectRawUnits = formulaItem.raws.filter((item: IRawInFormula) => item.unit.id === 0).length === 0
        const hasIncorrectRawCount = formulaItem.raws.filter((item: IRawInFormula) => item.raw_value === 0).length === 0
        setProductError(!hasProduct)
        setCountError(!hasCalcAmount)
        setNoItemError(!hasRawItems || !hasIncorrectRawValues || !hasIncorrectRawUnits || !hasIncorrectRawCount)
        return hasProduct && hasCalcAmount && hasRawItems && hasIncorrectRawValues
            && hasIncorrectRawUnits && hasIncorrectRawCount
    }

    /**
     * ???????????????????? ??????????????????
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try {
            if (formulaId === NEW_RECORD_VALUE) {
                await dispatch(addNewFormula(formulaItem));
            } else {
                await dispatch(updateFormula(formulaItem));
            }
            resolve();
        }catch (e) {
            console.log('reject')
            reject()
        }
    });

    /**
     * ?????????????????? ??????????????????
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    history.push('/catalogs/formula');
                }
            ).catch(() => {
                console.log('Error....')
            }).finally(
                () => {
                    console.log('saveHandler_end');
                }
            );
        }
        else{
            dispatch(showInfoMessage('error', '?????????????????? ?????????????????? ????????????!'))
        }
        event.preventDefault();
    };

    useEffect(()=>{
        dispatch(loadRaws())
        dispatch(loadUnit())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect( ()=> {
            dispatch(loadProduct());
            dispatch(loadFormulaItem(formulaId));
        }, [dispatch, formulaId]
    );

    const getCard = () => {
        return (
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader subheader="" title="??????????????????"/>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={10}
                            >
                                <Paper elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        disabled={true}
                                        label="?????????????? ???? ??????????????"
                                        margin="dense"
                                        name="unit"
                                        onChange={handleChange}
                                        required
                                        value={formulaItem.product.name}
                                        variant="outlined"
                                        helperText={hasProductError ? "???????????????????????? ????????" : ""}
                                        error={hasProductError}
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeProduct}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                            {formulaId !== NEW_RECORD_VALUE &&
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    label="???????? ????????????????"
                                    margin="dense"
                                    name="specification"
                                    value={moment(formulaItem.created).format('DD/MM/YYYY')}
                                    variant="outlined"
                                />
                            </Grid>
                            }
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="??????????????"
                                    margin="dense"
                                    name="calcAmount"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.calcAmount}
                                    variant="outlined"
                                    helperText={hasCountError ? "???????????????????????????? ????????????????" : ""}
                                    error={hasCountError}
                                    InputProps={{
                                        readOnly: formulaId !== NEW_RECORD_VALUE,
                                    }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="% ????????????"
                                    margin="dense"
                                    name="calcLosses"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.calcLosses}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="????????????, ??????????"
                                    margin="dense"
                                    name="calcLosses"
                                    onChange={handleChange}
                                    required
                                    value={ formulaItem.calcAmount * formulaItem.calcLosses/100}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={3}
                            >
                                <TextField
                                    fullWidth
                                    type={'number'}
                                    label="??????????????????, ??/????3"
                                    margin="dense"
                                    name="density"
                                    onChange={handleChange}
                                    required
                                    value={formulaItem.density}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="????????????????????????"
                                    margin="dense"
                                    name="specification"
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    value={formulaItem.specification}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={10}>
                                <Typography variant={"h5"}>
                                    ???????????? ?????????? ?? ??????????????????
                                </Typography>
                            </Grid>
                            <Grid item xs={1} >
                                <Fab color="default" aria-label="add" onClick={(event) => {handleCalculation()}}>
                                    <Tooltip title={'??????????????????????'}>
                                        <OpacityIcon />
                                    </Tooltip>
                                </Fab>
                            </Grid>

                            <Grid item xs={1} >
                                <Fab color="default" aria-label="add" onClick={(event) => {handleAddNewRawItem()}}>
                                    <Tooltip title={'???????????????? ?????????? ??????????'}>
                                        <AddIcon />
                                    </Tooltip>
                                </Fab>
                            </Grid>
                            {hasNoItemsError &&
                                <Grid item xs={12}>
                                    <Typography color={"error"}>
                                        ?????????????????? ???????????? ?????????????????? ?????????? ?? ???????????? ???????? ?????????????? ?????????????? ??????????????????...
                                    </Typography>
                                </Grid>
                            }
                            {formulaItem.raws.map((rawItem: IRawInFormula) =>(
                                <FormulaRawItem
                                    key={rawItem.id}
                                    item={rawItem}
                                    onChangeRawItem={handleChangeRawItem}
                                    onChangeUnitItem={handleChangeUnitItem}
                                    onDeleteItem={handleDeleteRawItem}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type={"submit"}
                        >
                            ??????????????????
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/formula'))}
                        >
                            ????????????????
                        </Button>
                    </CardActions>
                </form>
            </Card>
        )
    };

    return (
        <div className={classes.root}>
            {
                isLoading ? <CircularIndeterminate/>
                :
                getCard()
            }
        </div>
    );
};

export default FormulaItem;
