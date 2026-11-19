import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CATEGORY_ACCENTS, radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { confirmAction } from '@/lib/confirm';
import type { Category } from '@/types/models';

type Props = {
  visible: boolean;
  categories: Category[];
  onClose: () => void;
  onAdd: (input: { name: string; accentColor: string; icon?: string }) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<Category, 'name' | 'accentColor' | 'icon'>>,
  ) => void;
  onDelete: (id: string) => void;
};

export function CategoryManager({
  visible,
  categories,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [accent, setAccent] = useState<string>(CATEGORY_ACCENTS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAccent, setEditAccent] = useState<string>(CATEGORY_ACCENTS[0]);

  const resetAdd = () => {
    setName('');
    setAccent(CATEGORY_ACCENTS[categories.length % CATEGORY_ACCENTS.length]);
  };

  const submitAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ name: trimmed, accentColor: accent, icon: 'tag' });
    resetAdd();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditAccent(cat.accentColor);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    onUpdate(editingId, { name: editName.trim(), accentColor: editAccent });
    setEditingId(null);
  };

  const confirmDelete = (cat: Category) => {
    confirmAction(uk.categories.delete, uk.categories.deleteConfirmBody, {
      confirmLabel: uk.categories.deleteConfirm,
      cancelLabel: uk.categories.cancel,
      destructive: true,
      onConfirm: () => {
        if (editingId === cat.id) setEditingId(null);
        onDelete(cat.id);
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.elevated, borderColor: colors.border },
          ]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>
            {uk.categories.title}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((cat) => {
              const editing = editingId === cat.id;
              return (
                <View
                  key={cat.id}
                  style={[
                    styles.card,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  {editing ? (
                    <>
                      <TextInput
                        value={editName}
                        onChangeText={setEditName}
                        style={[styles.input, { color: colors.text }]}
                      />
                      <View style={styles.swatches}>
                        {CATEGORY_ACCENTS.map((c) => (
                          <Pressable
                            key={c}
                            onPress={() => setEditAccent(c)}
                            style={[
                              styles.swatch,
                              {
                                backgroundColor: c,
                                borderColor:
                                  editAccent === c ? colors.text : 'transparent',
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.actions}>
                        <Pressable onPress={() => setEditingId(null)}>
                          <Text style={{ color: colors.secondary }}>
                            {uk.categories.cancel}
                          </Text>
                        </Pressable>
                        <Pressable onPress={saveEdit}>
                          <Text style={{ color: colors.accent, fontWeight: '600' }}>
                            {uk.categories.save}
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    <View style={styles.cardRow}>
                      <View
                        style={[styles.dot, { backgroundColor: cat.accentColor }]}
                      />
                      <Text style={[styles.cardName, { color: colors.text }]}>
                        {cat.name}
                      </Text>
                      <Pressable onPress={() => startEdit(cat)} hitSlop={8}>
                        <Feather name="edit-2" size={16} color={colors.secondary} />
                      </Pressable>
                      <Pressable onPress={() => confirmDelete(cat)} hitSlop={8}>
                        <Feather name="trash-2" size={16} color={colors.danger} />
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}

            <Text style={[styles.section, { color: colors.secondary }]}>
              {uk.categories.add}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={uk.categories.namePlaceholder}
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderBottomColor: colors.border,
                  borderBottomWidth: 1,
                },
              ]}
            />
            <View style={styles.swatches}>
              {CATEGORY_ACCENTS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setAccent(c)}
                  style={[
                    styles.swatch,
                    {
                      backgroundColor: c,
                      borderColor: accent === c ? colors.text : 'transparent',
                    },
                  ]}
                />
              ))}
            </View>
            <Pressable
              style={[styles.addBtn, { backgroundColor: colors.invert }]}
              onPress={submitAdd}>
              <Text style={[styles.addBtnText, { color: colors.invertText }]}>
                {uk.categories.add}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  addBtn: {
    marginTop: 12,
    marginBottom: 20,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
