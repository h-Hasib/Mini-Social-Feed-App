// src/components/EditPostModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { ModalStyles } from "@/assets/styles/profile.styles";

export default function EditPostModal({ visible, onClose, post, onSave }: any) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(post?.content ?? "");
  }, [post]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ModalStyles.overlay}>
        <View style={ModalStyles.modal}>
          <Text style={ModalStyles.modalTitle}>Edit Post</Text>

          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
            style={[ModalStyles.input, { height: 120 }]}
          />

          <View style={ModalStyles.row}>
            <TouchableOpacity
              onPress={onClose}
              style={[ModalStyles.modalButton, { backgroundColor: "#ccc" }]}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            {/* FIXED: Proper onSave call */}
            <TouchableOpacity
              onPress={() =>
                onSave({
                  ...post,
                  content: text,
                  editedAt: new Date().toISOString(),
                })
              }
              style={[ModalStyles.modalButton, { backgroundColor: "#0b84ff" }]}
            >
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
