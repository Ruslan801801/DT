import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
state: State = { hasError: false, error: null };
static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
componentDidCatch(error: Error, info: any) { console.error('ErrorBoundary', error, info); }
reset = () => this.setState({ hasError: false, error: null });
render() {
if (!this.state.hasError) return this.props.children;
return (
<View style={s.c}>
<Text style={s.t}>Что-то пошло не так</Text>
<Text style={s.m}>{this.state.error?.message}</Text>
<TouchableOpacity onPress={this.reset} style={s.b}><Text style={s.bt}>Попробовать снова</Text></TouchableOpacity>
</View>
);
}
}
const s = StyleSheet.create({ c:{flex:1,alignItems:'center',justifyContent:'center',padding:20}, t:{fontSize:18,fontWeight:'600'}, m:{marginVertical:12,textAlign:'center'}, b:{padding:10,backgroundColor:'#007AFF',borderRadius:8}, bt:{color:'#fff',fontWeight:'600'} });