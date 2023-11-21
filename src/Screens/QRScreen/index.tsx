import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const QRScreen = () => {
  const [scannedData, setScannedData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // Function to handle QR code reading
  const handleQRRead = (data) => {
    setScannedData(data.data);
    setModalVisible(true);
    setScannerVisible(false); // Hide the scanner

    // Reset countdown when a new QR code is scanned during the countdown
    setCountdown(5); // Reset countdown
  };

  useEffect(() => {
    let countdownInterval;

    if (isModalVisible) {
      // Update countdown every second while the modal is visible
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            // If countdown reaches 1, close the modal and show the scanner
            clearInterval(countdownInterval);
            setModalVisible(false);
            setScannedData(null);
            setScannerVisible(true); // Show the scanner
            return 5; // Reset countdown
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      // Cleanup timer on component unmount or when modal is closed
      clearInterval(countdownInterval);
    };
  }, [isModalVisible]);

  return (
    <View style={styles.container}>
      {isScannerVisible && (
        <QRCodeScanner
          onRead={(data) => handleQRRead(data)}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topViewStyle={styles.transparentView}
          bottomViewStyle={styles.transparentView}
          cameraStyle={styles.cameraStyle}
        />
      )}

      {/* Modal for displaying the scanned data */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>QR Scanned</Text>
          <Text style={styles.modalText}>Scanned Value: {scannedData}</Text>
          <Text style={styles.modalText}>Closing in {countdown} seconds...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transparentView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraStyle: {
    height: hp('100%'), // 100% of the screen height
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: wp('4%'), // Adjust font size responsively
    color: 'black',
    marginBottom: hp('2%'), // Adjust margin bottom responsively
  },
});

export default QRScreen;
