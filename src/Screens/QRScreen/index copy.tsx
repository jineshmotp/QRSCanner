import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Platform } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import CountDown from 'react-native-countdown-component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const QRScannerApp: React.FC = () => {
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    // Request camera permission when the component mounts
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );

      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const onSuccess = (e: any) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(e.data);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setScanned(false);
      }, 5000);
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={onSuccess}
        reactivate={true}
        reactivateTimeout={2000}
        showMarker={true}
        markerStyle={styles.markerStyle}
        bottomContent={
          <Text style={styles.bottomText}>Move the camera to scan QR code</Text>
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>QR Scanned</Text>
          <CountDown
            until={5}
            onFinish={() => setModalVisible(false)}
            size={widthPercentageToDP('5%')}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: '#1CC625' }}
            timeToShow={['S']}
            timeLabels={{ s: 'Seconds' }}
          />
          <Text style={styles.modalText}>Scanned Value: {scannedData}</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerStyle: {
    borderColor: '#FFF',
  },
  bottomText: {
    fontSize: heightPercentageToDP('2%'),
    color: '#FFF',
    marginTop: heightPercentageToDP('1%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: heightPercentageToDP('2%'),
    color: '#FFF',
    marginBottom: heightPercentageToDP('1%'),
  },
});

export default QRScannerApp;
