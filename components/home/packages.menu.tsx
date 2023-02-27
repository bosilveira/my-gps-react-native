import * as React from 'react';
import { View } from 'react-native';
import { Menu, Divider, Text, IconButton } from 'react-native-paper';

// types
import type { DatabaseState } from '../../types/databaseState.type';
import { DatabaseSorting } from '../../types/databaseState.type';

// redux
import { AppDispatch, RootState } from '../../redux/store.redux';
import { useSelector, useDispatch } from 'react-redux';
import { setSortingASC, setSortingDESC, setItemsPerPage } from '../../redux/database.slice';

const PackagesMenu = () => {

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const database = useSelector((state: RootState) => state.database) as DatabaseState;

    // Menu controller
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        anchor={<IconButton icon="sort"onPress={openMenu} />}>
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Sorting</Text>
            <Menu.Item leadingIcon="sort-clock-ascending-outline" onPress={() => dispatch(setSortingASC())} title="Ascending"
            disabled={database.sorting === DatabaseSorting.ASC}
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="sort-clock-descending-outline" onPress={() => dispatch(setSortingDESC())} title="Descending"
            disabled={database.sorting === DatabaseSorting.DESC}
            style={{paddingHorizontal: 24}}
            />
            <Divider />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Items per Page</Text>
            <Menu.Item leadingIcon="file-outline" onPress={() => dispatch(setItemsPerPage(8))} title="8 Items"
            disabled={database.itemsPerPage === 8}
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="file-outline" onPress={() => dispatch(setItemsPerPage(16))} title="16 Items"
            disabled={database.itemsPerPage === 16}
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="file-outline" onPress={() => dispatch(setItemsPerPage(32))} title="32 Items"
            disabled={database.itemsPerPage === 32}
            style={{paddingHorizontal: 24}}
            />
        </Menu>
    </View>
  );
};

export default PackagesMenu;