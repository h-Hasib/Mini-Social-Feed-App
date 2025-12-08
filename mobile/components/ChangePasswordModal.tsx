// src/components/ChangePasswordModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { ModalStyles } from "@/assets/styles/profile.styles";
import * as authService from "@/services/authService";

export default function ChangePasswordModal({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void; }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    if (!oldPw || !newPw) return Alert.alert("Error", "Please fill fields");
    if (newPw !== confirmPw) return Alert.alert("Error", "Passwords do not match");

    setLoading(true);
    try {
      // await authService.changePassword({ oldPassword: oldPw, newPassword: newPw });
      onSuccess();
    } catch (e) {
      Alert.alert("Error", "Could not change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.modal}>
          <Text style={ModalStyles.modalTitle}>Change Password</Text>

          <TextInput placeholder="Old password" secureTextEntry value={oldPw} onChangeText={setOldPw} style={ModalStyles.input} />
          <TextInput placeholder="New password" secureTextEntry value={newPw} onChangeText={setNewPw} style={ModalStyles.input} />
          <TextInput placeholder="Confirm new password" secureTextEntry value={confirmPw} onChangeText={setConfirmPw} style={ModalStyles.input} />

          <View style={ModalStyles.row}>
            <TouchableOpacity onPress={onClose} style={[ModalStyles.modalButton, { backgroundColor: "#ccc" }]}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleChange} style={[ModalStyles.modalButton, { backgroundColor: "#0b84ff" }]}>
              <Text style={{ color: "#fff" }}>{loading ? "..." : "Change"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
