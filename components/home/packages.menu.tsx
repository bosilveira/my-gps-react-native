import * as React from 'react';
import { View } from 'react-native';
import { Menu, Divider, Appbar, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Nav = { navigate: (value: string) => void }

const PackagesMenu = () => {

    const { navigate } = useNavigation<Nav>()

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
            <Menu.Item leadingIcon="sort-clock-ascending-outline" onPress={() => navigate('Packages')} title="Ascending"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="sort-clock-descending-outline" onPress={() => navigate('Sync')} title="Descending"
            style={{paddingHorizontal: 24}}
            />
            <Divider />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Items per Page</Text>
            <Menu.Item leadingIcon="file-outline" onPress={() => navigate('Database')} title="8 Items"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="file-outline" onPress={() => navigate('Location')} title="16 Items"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="file-outline" onPress={() => navigate('Location')} title="32 Items"
            style={{paddingHorizontal: 24}}
            />
            
        </Menu>
      </View>
  );
};

export default PackagesMenu;