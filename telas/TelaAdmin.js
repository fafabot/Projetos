import React, { useEffect, useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
Image,
StyleSheet,
FlatList,
ActivityIndicator,
Alert,
KeyboardAvoidingView,
Platform,
} from 'react-native';
import { bancoDados } from '../config/firebaseConfig';
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';const camposIniciais = {
Produto: '',
Preço: '',
Descrição: '',
Foto: '',
Foto2: '',
Foto3: '',
ValorNormal: '',
ValorDesconto: '',
Desconto: '',
};export default function TelaAdmin() {
const [produtos, setProdutos] = useState([]);
const [carregando, setCarregando] = useState(true);
const [salvando, setSalvando] = useState(false);
const [novoProduto, setNovoProduto] = useState(camposIniciais);
const [mostrarFormulario, setMostrarFormulario] = useState(false);
const [editandoId, setEditandoId] = useState(null);

// Buscar produtos em tempo real do Firestore
useEffect(() => {
  const produtosRef = collection(bancoDados, 'produtos');
  const desinscrever = onSnapshot(
    produtosRef,
    (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProdutos(lista);
      setCarregando(false);
    },
    (erro) => {
      console.error('Erro ao buscar produtos:', erro);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      setCarregando(false);
});

  return desinscrever;
}, []);

// Popular com produtos padrão se estiver vazio
const popularProdutosPadrao = async () => {
setCarregando(true);
try {
const produtosRef = collection(bancoDados, 'produtos');
const produtosExemplo = [

{
  Produto: 'EA Sports FC 26',
  Preço: '199.90',
  Descrição: 'Simulador de futebol com gráficos realistas, modo carreira aprimorado e partidas online competitivas.',
  Foto: 'https://cdn2.unrealengine.com/fc26-standard-edition-1920x1080.jpg',
  ValorNormal: '299.90',
  ValorDesconto: '100.00',
  Desconto: '33%'
},

{
  Produto: 'Rocket League',
  Preço: '59.90',
  Descrição: 'Misture futebol e carros em partidas rápidas e emocionantes, com modos online e competitivos.',
  Foto: 'https://rocketleague.media.zestyio.com/rl_keyart.jpg',
  ValorNormal: '99.90',
  ValorDesconto: '40.00',
  Desconto: '40%'
},

{
  Produto: 'The Witcher 3',
  Preço: '69.90',
  Descrição: 'RPG de fantasia com um vasto mundo aberto, combates estratégicos e centenas de missões para explorar.',
  Foto: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
  ValorNormal: '139.90',
  ValorDesconto: '70.00',
  Desconto: '50%'
},

{
  Produto: 'Forza Horizon 5',
  Preço: '149.90',
  Descrição: 'Jogo de corrida em mundo aberto ambientado no México, com centenas de carros e eventos dinâmicos.',
  Foto: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Forza_Horizon_5_cover.jpg',
  ValorNormal: '249.90',
  ValorDesconto: '100.00',
  Desconto: '40%'
}
];for (const prod of produtosExemplo) {
await addDoc(produtosRef, prod);
}
Alert.alert('Sucesso', 'Produtos padrão criados no Firestore para demonstração!');
} catch (erro) {
console.error("Erro ao popular produtos:", erro);
Alert.alert('Erro', 'Falha ao gerar produtos padrão.');
} finally {
setCarregando(false);
}
};const atualizarCampo = (campo, valor) => {
setNovoProduto((anterior) => ({ ...anterior, [campo]: valor }));
};const toggleFormulario = () => {
if (mostrarFormulario) {
setNovoProduto(camposIniciais);
setEditandoId(null);
}
setMostrarFormulario(!mostrarFormulario);
};const iniciarEdicao = (produto) => {
setEditandoId(produto.id);
setNovoProduto({
Produto: produto.Produto || '',
Preço: produto.Preço || '',
Descrição: produto.Descrição || '',
Foto: produto.Foto || '',
Foto2: produto.Foto2 || '',
Foto3: produto.Foto3 || '',
ValorNormal: produto.ValorNormal || '',
ValorDesconto: produto.ValorDesconto || '',
Desconto: produto.Desconto || '',
});
setMostrarFormulario(true);
};const salvarProduto = async () => {
const { Produto, Preço } = novoProduto;
if (!Produto.trim() || !Preço.trim()) {
Alert.alert('Atenção', 'Nome do produto e Preço são obrigatórios.');
return;
}setSalvando(true);
try {
const fotoFinal = novoProduto.Foto.trim()
? novoProduto.Foto
: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60';
const foto2Final = novoProduto.Foto2.trim();
const foto3Final = novoProduto.Foto3.trim();if (editandoId) {
// Atualizar produto existente
const produtoRef = doc(bancoDados, 'produtos', editandoId);
  const payload = {
        ...novoProduto,
        Foto: fotoFinal,
        Foto2: foto2Final,
        Foto3: foto3Final,
        // Campos adicionais para compatibilidade com TelaHome
        nome: novoProduto.Produto || '',
        preco: novoProduto.Preço || '',
        precoOriginal: novoProduto.ValorNormal || '',
        imagem: fotoFinal || '',
        updatedAt: new Date(),
      };
      await updateDoc(produtoRef, payload);
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto atualizado com sucesso!');
} else {
Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
}
} else {
// Cadastrar novo produto
const produtosRef = collection(bancoDados, 'produtos');
      const payload = {
        ...novoProduto,
        Foto: fotoFinal,
        Foto2: foto2Final,
        Foto3: foto3Final,
        // Campos adicionais para compatibilidade com TelaHome
        nome: novoProduto.Produto || '',
        preco: novoProduto.Preço || '',
        precoOriginal: novoProduto.ValorNormal || '',
        imagem: fotoFinal || '',
        createdAt: new Date(),
      };
      await addDoc(produtosRef, payload);
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto cadastrado com sucesso!');
} else {
Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
}
}setNovoProduto(camposIniciais);
setEditandoId(null);
setMostrarFormulario(false);
} catch (erro) {
console.error("Erro ao salvar produto:", erro);
if (Platform.OS === 'web') {
window.alert('Erro: Não foi possível salvar o produto.');
} else {
Alert.alert('Erro', 'Não foi possível salvar o produto.');
}
} finally {
setSalvando(false);
}
};const deletarProduto = (id, nome) => {
const acaoExcluir = async () => {
try {
await deleteDoc(doc(bancoDados, 'produtos', id));
if (Platform.OS === 'web') {
window.alert('Sucesso: Produto removido com sucesso.');
} else {
Alert.alert('Sucesso', 'Produto removido com sucesso.');
}
} catch (erro) {
console.error("Erro ao deletar produto:", erro);
if (Platform.OS === 'web') {
window.alert('Erro: Não foi possível remover o produto.');
} else {
Alert.alert('Erro', 'Não foi possível remover o produto.');
}
}
};if (Platform.OS === 'web') {
const confirmou = window.confirm(`Deseja realmente deletar o produto "${nome}"?`);
if (confirmou) {
acaoExcluir();
}
} else {
Alert.alert(
'Confirmar Exclusão',
`Deseja realmente deletar o produto "${nome}"?`,
[
{ text: 'Cancelar', style: 'cancel' },
{
text: 'Excluir',
style: 'destructive',
onPress: acaoExcluir
}
]
);
}
};const formatarMoeda = (valor) => {
if (!valor) return 'R$ 0,00';
const num = parseFloat(valor.toString().replace(',', '.'));
if (isNaN(num)) return `R$ ${valor}`;
return `R$ ${num.toFixed(2).replace('.', ',')}`;
};const renderItem = ({ item }) => {
// Calcular desconto percentual se não estiver preenchido mas termos ValorNormal e Preço
let descontoTexto = item.Desconto;
if (!descontoTexto && item.ValorNormal && item.Preço) {
const normal = parseFloat(item.ValorNormal.toString().replace(',', '.'));
const preco = parseFloat(item.Preço.toString().replace(',', '.'));
if (!isNaN(normal) && !isNaN(preco) && normal > preco) {
const perc = Math.round(((normal - preco) / normal) * 100);
descontoTexto = `${perc}%`;
}
}return (
<View style={estilos.card}>
<Image source={{ uri: item.Foto }} style={estilos.imagemProduto} resizeMode="cover" />{/* Botão de excluir no topo esquerdo */}
<TouchableOpacity
style={estilos.botaoDeletar}
onPress={() => deletarProduto(item.id, item.Produto)}
>
<Text style={estilos.textoBotaoDeletar}>🗑️</Text>
</TouchableOpacity>{/* Badge de desconto no topo direito */}
{descontoTexto ? (
<View style={estilos.badgeDesconto}>
<Text style={estilos.textoBadgeDesconto}>{descontoTexto} OFF</Text>
</View>
) : null}
<View style={estilos.infoContainer}>
<Text numberOfLines={2} style={estilos.nomeProduto}>{item.Produto}</Text>
{item.Descrição ? (
<Text numberOfLines={1} style={estilos.descricaoProduto}>{item.Descrição}</Text>
) : null}<View style={estilos.precosContainer}>
{item.ValorNormal ? (
<Text style={estilos.precoNormal}>{formatarMoeda(item.ValorNormal)}</Text>
) : null}
<Text style={estilos.precoVenda}>{formatarMoeda(item.Preço)}</Text>{item.ValorDesconto ? (
<Text style={estilos.valorDescontoDescricao}>
Economize {formatarMoeda(item.ValorDesconto)}
</Text>
) : null}
</View><TouchableOpacity style={estilos.botaoEditar} onPress={() => iniciarEdicao(item)}>
<Text style={estilos.textoBotaoEditar}>✏️ Editar</Text>
</TouchableOpacity>
</View>
</View>
);
};return (
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={estilos.container}
>
<View style={estilos.header}>
<Text style={estilos.subtitulo}>
{produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
</Text>
<TouchableOpacity
style={estilos.botaoToggleForm}
onPress={toggleFormulario}
>
<Text style={estilos.textoBotaoToggleForm}>
{mostrarFormulario
? (editandoId ? 'Fechar Edição ✖' : 'Fechar Cadastro ✖')
: 'Novo Produto ➕'}
</Text>
</TouchableOpacity>
</View>{mostrarFormulario && (
<View style={estilos.formulario}>
<Text style={estilos.tituloFormulario}>
{editandoId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
</Text>
<TextInput
placeholder="Nome do Produto *"
style={estilos.input}
value={novoProduto.Produto}
onChangeText={(v) => atualizarCampo('Produto', v)}
/><TextInput
placeholder="Descrição (Opcional)"
style={estilos.input}
value={novoProduto.Descrição}
onChangeText={(v) => atualizarCampo('Descrição', v)}
/><View style={estilos.inputLinha}>
<TextInput
placeholder="Preço Venda (ex: 89.90) *"
keyboardType="numeric"
style={[estilos.input, { flex: 1, marginRight: 8 }]}
value={novoProduto.Preço}
onChangeText={(v) => atualizarCampo('Preço', v)}
/>
<TextInput
placeholder="Preço Normal (ex: 120.00)"
keyboardType="numeric"
style={[estilos.input, { flex: 1 }]}
value={novoProduto.ValorNormal}
onChangeText={(v) => atualizarCampo('ValorNormal', v)}
/>
</View><View style={estilos.inputLinha}>
<TextInput
placeholder="Valor Desconto R$"
keyboardType="numeric"
style={[estilos.input, { flex: 1, marginRight: 8 }]}
value={novoProduto.ValorDesconto}
onChangeText={(v) => atualizarCampo('ValorDesconto', v)}
/>
<TextInput
placeholder="Desconto (ex: 25%)"
style={[estilos.input, { flex: 1 }]}
value={novoProduto.Desconto}
onChangeText={(v) => atualizarCampo('Desconto', v)}
/>
</View><TextInput
placeholder="URL da Foto Principal (Opcional)"
style={estilos.input}
value={novoProduto.Foto}
onChangeText={(v) => atualizarCampo('Foto', v)}
/><TextInput
placeholder="URL da Foto 2 (Opcional)"
style={estilos.input}
value={novoProduto.Foto2}
onChangeText={(v) => atualizarCampo('Foto2', v)}
/><TextInput
placeholder="URL da Foto 3 (Opcional)"
style={estilos.input}
value={novoProduto.Foto3}
onChangeText={(v) => atualizarCampo('Foto3', v)}
/><TouchableOpacity
style={[estilos.botaoSalvar, salvando && estilos.botaoDesativado]}
onPress={salvarProduto}
disabled={salvando}
>
{salvando ? (
<ActivityIndicator color="#fff" />
) : (
<Text style={estilos.textoBotaoSalvar}>
{editandoId ? 'Salvar Alterações' : 'Salvar Produto no Firestore'}
</Text>
)}
</TouchableOpacity>
</View>
)}{carregando ? (
<View style={estilos.centralizado}>
<ActivityIndicator size="large" color="#007BFF" />
<Text style={estilos.textoCarregando}>Carregando produtos...</Text>
</View>
) : produtos.length === 0 ? (
<View style={estilos.semProdutos}>
<Text style={estilos.textoSemProdutos}>Nenhum produto cadastrado no Firestore.</Text>
<TouchableOpacity style={estilos.botaoPopular} onPress={popularProdutosPadrao}>
<Text style={estilos.textoBotaoPopular}>✨ Gerar Produtos de Exemplo</Text>
</TouchableOpacity>
</View>
) : (
<FlatList
data={produtos}
keyExtractor={(item) => item.id}
renderItem={renderItem}
numColumns={2}
columnWrapperStyle={estilos.linhaGrid}
contentContainerStyle={estilos.lista}
/>
)}
</KeyboardAvoidingView>
);
}const estilos = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#000000',
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 16,
paddingVertical: 12,
backgroundColor: '#000000',
borderBottomWidth: 1,
borderBottomColor: '#e1e8ed',
},
subtitulo: {
fontSize: 14,
color: '#ffff',
fontWeight: '600',
},
botaoToggleForm: {
backgroundColor: '#9D1212',
paddingVertical: 6,
paddingHorizontal: 12,
borderRadius: 20,
},
textoBotaoToggleForm: {
color: '#fff',
fontSize: 12,
fontWeight: 'bold',
},
formulario: {
backgroundColor: '#fff',
padding: 16,
borderBottomWidth: 1,
borderBottomColor: '#e1e8ed',
},
tituloFormulario: {
fontSize: 16,
fontWeight: 'bold',
marginBottom: 12,
color: '#14171a',
},
input: {
backgroundColor: '#f8f9fa',
borderWidth: 1,
borderColor: '#e1e8ed',
borderRadius: 8,
padding: 10,
marginBottom: 10,
fontSize: 14,
},
inputLinha: {
flexDirection: 'row',
justifyContent: 'space-between',
},
botaoSalvar: {
backgroundColor: '#28a745',
padding: 12,
borderRadius: 8,
alignItems: 'center',
marginTop: 6,
},
botaoDesativado: {
backgroundColor: '#94d3a2',
},
textoBotaoSalvar: {
color: '#fff',
fontWeight: 'bold',
fontSize: 14,
},
centralizado: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 20,
},
textoCarregando: {
marginTop: 10,
color: '#657786',
fontSize: 14,
},
semProdutos: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 40,
},
textoSemProdutos: {
fontSize: 16,
color: '#657786',
textAlign: 'center',
marginBottom: 20,
},
botaoPopular: {
backgroundColor: '#9D1212',
paddingVertical: 12,
paddingHorizontal: 20,
borderRadius: 25,
elevation: 2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
},
textoBotaoPopular: {
color: '#fff',
fontSize: 14,
fontWeight: 'bold',
},
lista: {
padding: 8,
},
linhaGrid: {
justifyContent: 'space-between',
},
card: {
backgroundColor: '#121212',
width: '48%',
borderRadius: 12,
marginBottom: 16,
overflow: 'hidden',
borderWidth: 1,
borderColor: '#4d4d4d',
elevation: 3,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.08,
shadowRadius: 8,
position: 'relative',
},
botaoDeletar: {
position: 'absolute',
top: 8,
left: 8,
zIndex: 10,
backgroundColor: 'rgba(255, 255, 255, 0.9)',
width: 28,
height: 28,
borderRadius: 14,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 1,
borderColor: '#e1e8ed',
},
textoBotaoDeletar: {
fontSize: 12,
},
badgeDesconto: {
position: 'absolute',
top: 8,
right: 8,
zIndex: 10,
backgroundColor: '#e0245e',
paddingVertical: 4,
paddingHorizontal: 8,
borderRadius: 12,
},
textoBadgeDesconto: {
color: '#fff',
fontSize: 10,
fontWeight: 'bold',
},
imagemProduto: {
width: '100%',
height: 140,
backgroundColor: '#f8f9fa',
},
infoContainer: {
padding: 10,
flex: 1,
justifyContent: 'space-between',
},
nomeProduto: {
fontSize: 14,
fontWeight: 'bold',
color: '#ffffff',
marginBottom: 4,
lineHeight: 18,
},
descricaoProduto: {
fontSize: 12,
color: '#657786',
marginBottom: 8,
},
precosContainer: {
marginBottom: 10,
},
precoNormal: {
fontSize: 12,
color: '#9D1212',
textDecorationLine: 'line-through',
marginBottom: 2,
},
precoVenda: {
fontSize: 16,
fontWeight: 'bold',
color: '#ffffff',
},
valorDescontoDescricao: {
fontSize: 10,
color: '#28a745',
fontWeight: '600',
marginTop: 2,
},
botaoEditar: {
backgroundColor: '#9D1212',
paddingVertical: 8,
borderRadius: 6,
alignItems: 'center',
marginTop: 4,
},
textoBotaoEditar: {
color: '#fff',
fontSize: 13,
fontWeight: 'bold',
},

});