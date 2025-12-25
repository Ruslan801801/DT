import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../services/api';

export default function Send() {
const [eid, setEid] = useState('');
const [amount, setAmount] = useState('50');
const [resp, setResp] = useState<any>(null);

const onSend = async () => {
const r = await api.p2pCreate({ sender_id:'demo', receiver_eid:eid, amount: Number(amount) });
setResp(r);
};

return (
<View style={{ flex:1, padding:16 }}>
<Text style={{ fontSize:20, fontWeight:'600' }}>Отправить</Text>
<TextInput placeholder="EID получателя" value={eid} onChangeText={setEid}
style={{ borderWidth:1, borderColor:'#ddd', marginVertical:8, padding:8 }} />
<TextInput placeholder="Сумма" value={amount} onChangeText={setAmount}
keyboardType="numeric" style={{ borderWidth:1, borderColor:'#ddd', marginVertical:8, padding:8 }} />
<TouchableOpacity onPress={onSend} style={{ padding:12, backgroundColor:'#4ade80', alignSelf:'flex-start' }}>
<Text style={{ color:'#000' }}>Отправить</Text>
</TouchableOpacity>
{resp && <Text style={{ marginTop:16 }}>Ответ: {JSON.stringify(resp)}</Text>}
</View>
);
}