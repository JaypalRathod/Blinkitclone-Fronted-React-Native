import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'

const ProductCategories = () => {

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  return (
    <View style={styles.mainContainer}>
      <CustomeHeader title={selectedCategories} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default ProductCategories