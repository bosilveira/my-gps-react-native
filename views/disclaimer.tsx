import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, Appbar, Divider, SegmentedButtons } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
type Props = NativeStackScreenProps<RootStackParamList, 'Disclaimer'>;

export default function DisclaimerPage({ navigation }: Props) {
    const [language, setLanguage] = React.useState('pt-BR');
    return (
    <>
    <StatusBar 
        animated={true}
        translucent={true}
        backgroundColor="#61dafb"/>
    <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Disclaimer" />
        <Appbar.Action icon="information-outline"/>
    </Appbar.Header>

    <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
      <SegmentedButtons
        value={language}
        onValueChange={setLanguage}
        buttons={[
          {
            value: 'en-US',
            label: 'English',
          },
          {
            value: 'pt-BR',
            label: 'Português',
          },
          { value: 'es-ES',
            label: 'Español'
         },
        ]}
      />
    </View>

    <ScrollView>
    { language === 'pt-BR' && <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
        <Text variant="titleLarge">Aviso</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="bodyLarge">
        Ao usar este aplicativo móvel, você concorda em nos permitir coletar os seguintes dados: sua localização atual, determinada por GPS, Wi-Fi ou sinais de rede celular.
        Usamos essas informações com o propósito de oferecer um melhor serviço e experiência.
        Levamos seu privacidade e segurança a sério e sempre nos comprometeremos a cumprir as leis aplicáveis,
        como o Regulamento Geral de Proteção de Dados (GDPR) (1) da União Europeia e a Lei Geral de Proteção de Dados Pessoais
        (LGPD) (2) do Brasil.
        Também empregamos medidas de segurança apropriadas para proteger seus dados e mantê-los seguros. Se você não quiser que coletemos e usemos seus dados de localização,
        pode optar por desativar os serviços de localização nas configurações do seu dispositivo. Observe que isso pode limitar as funcionalidades do aplicativo.
        </Text>
        <Divider style={{marginVertical: 6}} />
        <Text variant='labelLarge'>(1) GDPR, https://gdpr.eu</Text>
        <Text variant='labelLarge'>(2) LGPD, https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="labelLarge">My GPS &copy; Todos os direitos reservados.</Text>
        <Divider style={{marginVertical: 12}} />
    </View> }
    
    { language === 'en-US' && <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
        <Text variant="titleLarge">Disclaimer</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="bodyLarge">
        By using this mobile app, you agree to allow us to collect the following data: your current location, as determined by GPS, Wi-Fi, 
        or cellular network signals. We use this information for the purpose of providing you with a better service and experience. We take your privacy 
        and security seriously and will always comply with applicable laws such as the EU General Data Protection Regulation (GDPR) (1) 
        and the Brazilian Lei Geral de Proteção de Dados Pessoais (LGPD) (2). 
        We also employ appropriate security measures to protect your data and keep it secure. If you do not want us to collect and use your location data, 
        you may opt-out by disabling location services in your device's settings. Please note that this may limit the features of the application.
        </Text>
        <Divider style={{marginVertical: 6}} />
        <Text variant='labelLarge'>(1) GDPR, https://gdpr.eu</Text>
        <Text variant='labelLarge'>(2) LGPD, https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="labelLarge">My GPS &copy; All rights reserved.</Text>
        <Divider style={{marginVertical: 12}} />
    </View>}

    { language === 'es-ES' && <View style={{paddingVertical: 8, paddingHorizontal: 12}}>
        <Text variant="titleLarge">Descargo de responsabilidad</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="bodyLarge">
        Al usar esta aplicación móvil, acepta permitirnos recopilar los siguientes datos: su ubicación actual, 
        según lo determinen los señales de GPS, Wi-Fi o de red celular. Utilizamos esta información con el fin de brindarle un mejor servicio y experiencia. 
        Tomamos en serio su privacidad y seguridad y siempre cumpliremos con las leyes aplicables, como la Regulación General de Protección de Datos (GDPR) (1) 
        de la Unión Europea y la Lei Geral de Proteção de Dados Pessoais (LGPD) (2) de Brasil. También empleamos medidas de seguridad adecuadas para proteger
            sus datos y mantenerlos seguros. Si no desea que recopilemos y utilicemos sus datos de ubicación, 
        puede optar por deshabilitar los servicios de ubicación en la configuración de su dispositivo. Tenga en cuenta que esto puede limitar las características de la aplicación.
        </Text>
        <Divider style={{marginVertical: 6}} />
        <Text variant='labelLarge'>(1) GDPR, https://gdpr.eu</Text>
        <Text variant='labelLarge'>(2) LGPD, https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd</Text>
        <Divider style={{marginVertical: 12}} />
        <Text variant="labelLarge">My GPS &copy; Todos los derechos reservados.</Text>
        <Divider style={{marginVertical: 12}} />
        </View>}

    </ScrollView>
    </>
  );
}