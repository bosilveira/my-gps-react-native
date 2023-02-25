import * as React from 'react';
import { View } from 'react-native';
import { Button, Menu, Divider, Provider, Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Nav = {
    navigate: (value: string, {}: any) => void;
}


const HomeMenu = () => {

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
            style={{width: '75%'}}
            visible={visible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
            <Menu.Item leadingIcon="database" onPress={() => navigate('Packages',{})} title="Database" />
            <Menu.Item leadingIcon="sync" onPress={() => navigate('Packages',{})} title="Syncing" />
            <Divider />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Settings</Text>
            <Menu.Item leadingIcon="list-status" onPress={() => navigate('Database',{})} title="Database Settings" />
            <Menu.Item leadingIcon="car-connected" onPress={() => navigate('Location',{})} title="Tracking Settings" />
            <Menu.Item leadingIcon="cloud-upload-outline" onPress={() => navigate('Network',{})} title="Uploading Settings" />
            <Divider />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Info</Text>
            <Menu.Item leadingIcon="information-outline" onPress={() => navigate('Disclaimer',{})} title="Disclaimer" />
            <Menu.Item leadingIcon="security" onPress={() => navigate('Security',{})} title="Security" />
            <Menu.Item leadingIcon="help-circle-outline" onPress={() => navigate('Help',{})} title="Help" />
        </Menu>
      </View>
  );
};

export default HomeMenu;