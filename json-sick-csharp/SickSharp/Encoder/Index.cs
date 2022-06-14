using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using Newtonsoft.Json.Linq;
using SickSharp.Format.Tables;
using SickSharp.Primitives;

namespace SickSharp.Encoder
{
    public class Index
    {
        private Bijection<SByte> _bytes;
        private Bijection<Int16> _shorts;
        private Bijection<Int32> _ints;
        private Bijection<Int64> _longs;
        private Bijection<BigInteger> _bigints;
        
        private Bijection<Single> _floats;
        private Bijection<Double> _doubles;
        private Bijection<BigDecimal> _bigDecs;
        
        private Bijection<String> _strings;
        private Bijection<List<Ref>> _arrs;
        private Bijection<List<ObjEntry>> _objs;
        private Bijection<Root> _roots;
        
        public Index(Bijection<sbyte> bytes, Bijection<short> shorts, Bijection<int> ints, Bijection<long> longs, Bijection<BigInteger> bigints, Bijection<float> floats, Bijection<double> doubles, Bijection<BigDecimal> bigDecs, Bijection<string> strings, Bijection<List<Ref>> arrs, Bijection<List<ObjEntry>> objs, Bijection<Root> roots)
        {
            _bytes = bytes;
            _shorts = shorts;
            _ints = ints;
            _longs = longs;
            _floats = floats;
            _doubles = doubles;
            _bigDecs = bigDecs;
            _strings = strings;
            _arrs = arrs;
            _objs = objs;
            _roots = roots;
            _bigints = bigints;
        }

        public static Index Create()
        {
            return new Index(
                Bijection<sbyte>.Create("bytes", null),
                Bijection<short>.Create("shorts", null),
                Bijection<int>.Create("ints", null),
                Bijection<long>.Create("longs", null),
                Bijection<BigInteger>.Create("bigints", null),
                Bijection<Single>.Create("floats", null),
                Bijection<Double>.Create("doubles", null),
                Bijection<BigDecimal>.Create("bigdecs", null),
                Bijection<String>.Create("strings", null),
                Bijection<List<Ref>>.Create("arrays", new ListComparer<Ref>()),
                Bijection<List<ObjEntry>>.Create("objects", new ListComparer<ObjEntry>()),
                Bijection<Root>.Create("roots", null)
                );
        }

        public List<SerializedTable> SerializedTables()
        {
            return new List<SerializedTable>
            {
                new(_bytes.Name, new FixedArrayByteEncoder<sbyte>(Fixed.ByteEncoder).Bytes(_bytes.AsList())),
                new(_shorts.Name, new FixedArrayByteEncoder<short>(Fixed.ShortEncoder).Bytes(_shorts.AsList())),
                new(_ints.Name, new FixedArrayByteEncoder<int>(Fixed.IntEncoder).Bytes(_ints.AsList())),
                new(_longs.Name, new FixedArrayByteEncoder<long>(Fixed.LongEncoder).Bytes(_longs.AsList())),
                new(_bigints.Name, new VarArrayEncoder<BigInteger>(Variable.BigIntEncoder).Bytes(_bigints.AsList())),
                new(_floats.Name, new FixedArrayByteEncoder<float>(Fixed.FloatEncoder).Bytes(_floats.AsList())),
                new(_doubles.Name, new FixedArrayByteEncoder<double>(Fixed.DoubleEncoder).Bytes(_doubles.AsList())),
                new(_bigDecs.Name, new VarArrayEncoder<BigDecimal>(Variable.BigDecimalEncoder).Bytes(_bigDecs.AsList())),
                new(_strings.Name, new VarArrayEncoder<string>(Variable.StringEncoder).Bytes(_strings.AsList())),
                new(_arrs.Name,  new FixedArrayEncoder<List<Ref>>(FixedArray.RefListEncoder).Bytes(_arrs.AsList())),
                new(_objs.Name,  new FixedArrayEncoder<List<ObjEntry>>(FixedArray.ObjListEncoder).Bytes(_objs.AsList())),
                new(_roots.Name,  FixedArray.RootListEncoder.Bytes(_roots.AsList())),
            };
        }

        public SerializedIndex Serialize()
        {
            var version = 0;
            var tables = SerializedTables().Map(d => d.data).ToList();
            var headerLen = (2 + tables.Count) * Fixed.IntEncoder.BlobSize();
            var offsets = tables.ComputeOffsets(headerLen);

            var encodedOffsets = new FixedArrayByteEncoder<int>(Fixed.IntEncoder).Bytes(offsets);
            var header = new List<byte[]> {
                Fixed.IntEncoder.Bytes(version),
            } ;
            var everything = (header.Append(encodedOffsets).Append(tables).ToList()).Merge();
            return new SerializedIndex(everything);
        }

        // this can be externalized so Index won't depend on json.net
        public Ref append(String id, JToken json)
        {
            var idRef = addString(id);
            var rootRef = traverse(json);
            var root = new Root(idRef.Value, rootRef);
            return _roots.RevGet(root).Match(
                Some: some => throw new InvalidDataException(), 
                None: () => new Ref(RefKind.Root, _roots.Add(root))
                );
        }

        private Ref traverse(JToken json)
        {
            return json switch
            {
                JObject v =>
                    addObj(
                        v.Properties().Map(e => new ObjEntry(addString(e.Name).Value, traverse(e.Value))).ToList()
                        ),
                JArray v =>
                    addArr(v.Map(e => traverse(e)).ToList()),
                JValue v =>
                    v.Type switch
                    {
                        JTokenType.Integer => handleInt(v),
                        JTokenType.Float => handleFloat(v),
                        JTokenType.String => addString((string)v.Value),
                        JTokenType.Boolean => new Ref(RefKind.Bit, Convert.ToInt32((bool)v.Value)),
                        JTokenType.Null => new Ref(RefKind.Nul, 0),
                        JTokenType.Date => addString(((DateTime)v.Value).ToString()),
                        _ => throw new NotImplementedException($"failure: {v}")
                    ,
                    },
                _ => 
                    throw new NotImplementedException(),
            };
        }

        private Ref handleInt(JValue v)
        {
            return v.Value switch
            {
                Int64 i when i <= SByte.MaxValue && i >= SByte.MinValue => addByte(Convert.ToSByte(i)),
                Int64 i when i <= Int16.MaxValue && i >= Int16.MinValue => addShort(Convert.ToInt16(i)),
                Int64 i when i <= Int32.MaxValue && i >= Int32.MinValue => addInt(Convert.ToInt32(i)),
                Int64 i when i <= Int64.MaxValue && i >= Int64.MinValue => addLong(i),
                _ => throw new InvalidDataException($"Unexpected integer: {v}")
            };
        }
        private Ref handleFloat(JValue v)
        {
            return v.Value switch
            {
                Double i when i <= Single.MaxValue && i >= Single.MinValue => addFloat(Convert.ToSingle(i)),
                Double i when i <= Double.MaxValue && i >= Double.MinValue => addDouble(i),
                _ => throw new InvalidDataException($"Unexpected integer: {v}")
            };
        }

        private Ref addString(String s)
        {
            return new Ref(RefKind.Str, _strings.Add(s));
        }

        private Ref addByte(SByte s)
        {
            return new Ref(RefKind.Byte, _bytes.Add(s));
        }

        private Ref addShort(Int16 s)
        {
            return new Ref(RefKind.Short, _shorts.Add(s));
        }

        private Ref addInt(Int32 s)
        {
            return new Ref(RefKind.Int, _ints.Add(s));
        }

        private Ref addLong(Int64 s)
        {
            return new Ref(RefKind.Lng, _longs.Add(s));
        }

        private Ref addBigInt(BigInteger s)
        {
            return new Ref(RefKind.BigInt, _bigints.Add(s));
        }

        private Ref addFloat(Single s)
        {
            return new Ref(RefKind.Flt, _floats.Add(s));
        }

        private Ref addDouble(Double s)
        {
            return new Ref(RefKind.Dbl, _doubles.Add(s));
        }

        private Ref addBigDec(BigDecimal s)
        {
            return new Ref(RefKind.BigDec, _bigDecs.Add(s));
        }

        private Ref addArr(List<Ref> s)
        {
            return new Ref(RefKind.Arr, _arrs.Add(s));
        }

        private Ref addObj(List<ObjEntry> s)
        {
            return new Ref(RefKind.Obj, _objs.Add(s));
        }
    }

    public record SerializedIndex(byte[] data);
    public record SerializedTable(string name, byte[] data);

}