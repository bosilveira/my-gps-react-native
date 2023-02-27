import * as React from 'react';
import { View } from 'react-native';
import { Menu, Divider, Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Nav = { navigate: (value: string) => void }

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
        visible={visible}
        onDismiss={closeMenu}
        anchorPosition="bottom"
        anchor={<Appbar.Action icon="menu" onPress={openMenu} />}>
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Settings</Text>
            <Menu.Item leadingIcon="car-connected" onPress={() => navigate('Location')} title="Location Settings"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="cloud-upload-outline" onPress={() => navigate('Network')} title="Network Settings"
            style={{paddingHorizontal: 24}}
            />
            <Divider />
            <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 8}} >Info</Text>
            <Menu.Item leadingIcon="information-outline" onPress={() => navigate('Disclaimer')} title="Disclaimer"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="security" onPress={() => navigate('Security')} title="Security"
            style={{paddingHorizontal: 24}}
            />
            <Menu.Item leadingIcon="help-circle-outline" onPress={() => navigate('Help')} title="Help"
            style={{paddingHorizontal: 24}}
            />
            
        </Menu>
      </View>
  );
};

export default HomeMenu;