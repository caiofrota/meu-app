import { FilterButton } from "@/src/FilterButton";
import * as SQLite from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { Button, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const db = SQLite.openDatabaseSync("tarefas.db");

export default function Index() {
  const [tarefas, setTarefas] = useState<{ id: number; titulo: string; concluido: boolean }[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "concluidas">("todas");

  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      concluido INTEGER NOT NULL DEFAULT 0
      );
    `);
    carregarTarefas();
  }, []);

  function carregarTarefas() {
    const resultado = db.getAllSync<{ id: number; titulo: string; concluido: number }>("SELECT * FROM tarefas");
    setTarefas(
      resultado.map((tarefa) => ({
        id: tarefa.id,
        titulo: tarefa.titulo,
        concluido: tarefa.concluido === 1,
      })),
    );
  }

  function adicionarTarefa() {
    db.runSync("INSERT INTO tarefas (titulo, concluido) VALUES (?, ?)", novaTarefa, 0);
    setNovaTarefa("");
    carregarTarefas();
  }

  function toggleTarefa(id: number) {
    const tarefa = tarefas.find((item) => (item.id = id));
    db.runSync("UPDATE tarefas SET concluido = ? WHERE id = ?", tarefa?.concluido ? 0 : 1, id);
    carregarTarefas();
  }

  function deletarTarefa(id: number) {
    db.runSync("DELETE FROM tarefas WHERE id = ?", id);
    carregarTarefas();
  }

  const listaFiltrada = useMemo(() => {
    switch (filtro) {
      case "pendentes":
        return tarefas.filter((tarefa) => !tarefa.concluido);
      case "concluidas":
        return tarefas.filter((tarefa) => tarefa.concluido);
      default:
        return tarefas;
    }
  }, [tarefas, filtro]);

  const todasCount = tarefas.length;
  const pendentesCount = useMemo(() => tarefas.filter((t) => !t.concluido).length, [tarefas]);
  const concluidasCount = useMemo(() => tarefas.filter((t) => t.concluido).length, [tarefas]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <Button title="Adicionar" onPress={adicionarTarefa} />
      </View>

      <View style={styles.filters}>
        <FilterButton label={`Todas (${todasCount})`} active={filtro === "todas"} onPress={() => setFiltro("todas")} />
        <FilterButton
          label={`Pendentes (${pendentesCount})`}
          active={filtro === "pendentes"}
          onPress={() => setFiltro("pendentes")}
        />
        <FilterButton
          label={`Concluidas (${concluidasCount})`}
          active={filtro === "concluidas"}
          onPress={() => setFiltro("concluidas")}
        />
      </View>

      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
            <Pressable style={styles.itemRow} onPress={() => toggleTarefa(item.id)}>
              <View style={[styles.checkbox, item.concluido && styles.checkboxConcluido]} />
              <Text style={[styles.itemText, item.concluido && styles.itemTextConcluido]}>{item.titulo}</Text>
            </Pressable>
            <Button title="Delete" onPress={() => deletarTarefa(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c9ccd6",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 4,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
  checkboxConcluido: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  itemTextConcluido: {
    textDecorationLine: "line-through",
    color: "#777",
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
});
