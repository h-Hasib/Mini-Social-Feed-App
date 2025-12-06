// src/components/EditPostModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { ModalStyles } from "@/assets/styles/profile.styles";

export default function EditPostModal({ visible, onClose, post, onSave }: { visible: boolean; onClose: () => void; post: any; onSave: (p: any) => void; }) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(post?.text ?? "");
  }, [post]);

  async function handleSave() {
    if (!text.trim()) return Alert.alert("Validation", "Post text cannot be empty");
    onSave({ ...post, text, editedAt: new Date().toISOString() });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.modal}>
          <Text style={ModalStyles.modalTitle}>Edit Post</Text>

          <TextInput value={text} onChangeText={setText} multiline numberOfLines={4} style={[ModalStyles.input, { height: 120 }]} />

          <View style={ModalStyles.row}>
            <TouchableOpacity onPress={onClose} style={[ModalStyles.modalButton, { backgroundColor: "#ccc" }]}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={[ModalStyles.modalButton, { backgroundColor: "#0b84ff" }]}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
