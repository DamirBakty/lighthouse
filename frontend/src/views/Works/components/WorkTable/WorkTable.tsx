import React, {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom'
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {makeStyles} from '@material-ui/core/styles';
import {
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Link
} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import {IWork} from "types/model/work";
import {rowsPerPageArray} from "../../../../utils/AppConst";

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1050
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    tableRow: {}
}));

interface IWorkTableProps {
    className: string,
    workItems: IWork[],
    onClickItem: any,
    onChangeSelected: any,
}


const WorkTable = (props: IWorkTableProps) => {
    const {className, workItems, onClickItem, onChangeSelected, ...rest} = props;
    const classes = useStyles();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {workItems} = props;

        let selectedElements: number[];

        if (event.target.checked) {
            selectedElements = workItems.map(item => item.id);
        } else {
            selectedElements = [];
        }
        onChangeSelected(selectedElements);
        setSelectedItems(selectedElements);
    };

    const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const selectedIndex = selectedItems.indexOf(id);
        let newSelectedItems: number[] = [];

        if (selectedIndex === -1) {
            newSelectedItems = newSelectedItems.concat(selectedItems, id);
        } else if (selectedIndex === 0) {
            newSelectedItems = newSelectedItems.concat(selectedItems.slice(1));
        } else if (selectedIndex === selectedItems.length - 1) {
            newSelectedItems = newSelectedItems.concat(selectedItems.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedItems = newSelectedItems.concat(
                selectedItems.slice(0, selectedIndex),
                selectedItems.slice(selectedIndex + 1)
            );
        }
        onChangeSelected(newSelectedItems);
        setSelectedItems(newSelectedItems);
    };

    const handlePageChange = (event: any, page: number) => {
        setPage(page);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const cellClicked = (itemId: number) => {
        onClickItem(itemId);
    };

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedItems.length === workItems.length}
                                            color="primary"
                                            indeterminate={
                                                selectedItems.length > 0 &&
                                                selectedItems.length < workItems.length
                                            }
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>????????????????????????</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workItems.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(item => (
                                    <TableRow
                                        className={classes.tableRow}
                                        hover
                                        key={item.id}
                                        selected={selectedItems.indexOf(item.id) !== -1}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedItems.indexOf(item.id) !== -1}
                                                color="primary"
                                                onChange={event => handleSelectOne(event, item.id)}
                                                value="true"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                color="inherit"
                                                component={RouterLink}
                                                to={`/catalogs/works/${item.id}`}
                                            >
                                                {item.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" color="primary"
                                                    onClick={event => cellClicked(item.id)}>??????????????</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
            <CardActions className={classes.actions}>
                <TablePagination
                    component="div"
                    count={workItems.length}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageArray}
                    labelRowsPerPage='?????????? ???? ????????????????:'
                    labelDisplayedRows={({from, to, count}) => `${from}-${to} ???? ${count}`}
                />
            </CardActions>
        </Card>
    );
};

export default WorkTable;
