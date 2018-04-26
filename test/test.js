//works
export const test1 = `class Test1 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{height:100,width:100,backgroundColor:'#f00'}}>
                <Text style={{ textSize:12 , fontFamily: 'ScalaSansOT',fontSize: 12,letterSpacing: this.somestate ? 12: 13 }}>
                    {this.constructor.name}
                </Text>
            </View>
        );
    }}`;
// works
export const test2 = `class Test2 extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <Text>
                    {this.constructor.name}
                </Text>
            </View>
        );
    }}`;
// TODO: works
export const test3 = `
const styles = StyleSheet.create({
    hey: {
      height: 100,
      width: 100,
      backgroundColor: '#f00'
    },
    heya: {
      textSize: 12,
      fontFamily: 'ScalaSansOT',
      fontSize: 12,
      letterSpacing: this.somestate ? 12 : 13
    }
  }); 
  class Test1 extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return <View style={styles.heya}>
                  <Text style={styles.hey}>
                      {this.constructor.name}
                  </Text>
              </View>;
    }
  }`;

// works
export const test4 = `
   class Test1 extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return 
      <View style={{
        height: 100,
        width: 100,
        backgroundColor: '#f00'
      }}>
      <Text style={styles.dummy}>
        {this.constructor.name}
      </Text>
     </View>;
    }
  }
  const styles = StyleSheet.create({
    dummy: {
      textSize: 12,
      fontFamily: 'ScalaSansOT',
      fontSize: 12,
      letterSpacing: this.somestate ? 12 : 13
    }
  });
  `;
